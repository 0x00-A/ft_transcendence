from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

import pyotp
import qrcode

from app.settings import MEDIA_URL
from app.settings import SERVER_URL


class Enable2faRequest(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if user.is2fa_active:
            return Response(
                {'error': '2FA is already enabled for this account'},
                status=status.HTTP_400_BAD_REQUEST
            )
        user.otp_secret = pyotp.random_base32()
        user.save()
        privisioning_uri = pyotp.TOTP(user.otp_secret).provisioning_uri(
            name=user.username,
            issuer_name='ft_transcendence_2FA'
        )
        print('api ==> enable 2fa: Provisioning URI generated', privisioning_uri)
        qr = qrcode.make(privisioning_uri)
        qr.show()
        qr_code = f"{MEDIA_URL}qrcodes/{user.username}_2fa.png"
        print('=====QR_CODE=====', qr_code)
        qr.save(f"static{qr_code}")
        return Response({'qr_code': f"{SERVER_URL}{qr_code}"}, status=status.HTTP_200_OK)


class Enable2faView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if 'otp' not in request.data:
            return Response(
                {'error': 'Please provide OTP'},
                status=status.HTTP_400_BAD_REQUEST
            )
        user = request.user
        totp = pyotp.TOTP(user.otp_secret)
        print('request.data[otp]===>> ', request.data['otp'])
        print('user.otp_secret===>> ', request.user.otp_secret)
        if totp.verify(request.data['otp']):
            user = request.user
            user.is2fa_active = True
            user.save()
            print('api ==> verify otp: OTP verified successfully')
            return Response({'message': 'OTP verified successfully'}, status=status.HTTP_200_OK)
        else:
            print('api ==> verify otp: OTP verification failed')
            return Response(
                {'error': 'Invalid OTP'},
                status=status.HTTP_400_BAD_REQUEST
            )


class Disable2FAView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if not user.is2fa_active:
            return Response(
                {'error': '2FA is already disabled for this account'},
                status=status.HTTP_400_BAD_REQUEST
            )
        if 'password' not in request.data:
            return Response(
                {'error': 'Please provide your password'},
                status=status.HTTP_400_BAD_REQUEST
            )
        if not user.check_password(request.data['password']):
            return Response(
                {'error': 'Password is incorrect'},
                status=status.HTTP_400_BAD_REQUEST
            )
        user.otp_secret = None
        user.is2fa_active = False
        user.save()
        print('api ==> disable 2fa: 2FA disabled successfully')
        return Response({'message': '2FA disabled successfully'}, status=status.HTTP_200_OK)