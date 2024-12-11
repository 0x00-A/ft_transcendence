from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

import pyotp

from accounts.models import User
from accounts.utils import get_token_for_user


class LoginVerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        if 'otp' not in request.data:
            return Response({'error': 'OTP is required'}, status=status.HTTP_400_BAD_REQUEST)
        if 'username' not in request.data:
            return Response({'error': 'Username is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(username=request.data['username'])
            if not user.is2fa_active:
                return Response({'error': '2FA is not enabled by user'}, status=status.HTTP_400_BAD_REQUEST)
            if user.otp_secret:
                totp = pyotp.TOTP(user.otp_secret)
                if totp.verify(request.data['otp']):
                    token = get_token_for_user(user)
                    if token:
                        response = Response(data={'message': 'login success'}, status=status.HTTP_200_OK)
                        response.set_cookie(
                            key = 'access_token',
                            value = token['access'],
                            httponly = True,
                            secure = False,
                            samesite = 'Strict'
                        )
                        response.set_cookie(
                            key = 'refresh_token',
                            value = token['refresh'],
                            httponly = True,
                            secure = False,
                            samesite = 'Strict'
                        )
                        print('apiBackend ==> login verify otp status: login success')
                        return response
                    return Response({'error': 'Getting tokens for user failed'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
                return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'error': 'OTP secret not found'}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)