from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from ..models import User
from ..serializers import UserLoginSerializer
import random
from django.utils import timezone
from datetime import timedelta
from django.core.mail import send_mail
from rest_framework.views import APIView
# import pyotp



def generate_otp():
    return random.randint(100000, 999999)


def send_otp_email(user):
    send_mail(
        'Your 2FA Code',
        f'Your one-time code is: {user.otp_secret}',
        'mahdimardi18@gmail.com',
        [user.email],
        fail_silently=False,
    )

# class VerifyOTPView(APIView):
#     permission_classes = [AllowAny]

#     def post(self, request):
#         user = request.user
#         if user:

#         pass

class LoginView(CreateAPIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    serializer_class = UserLoginSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = authenticate(
            username = serializer.validated_data['username'],
            password = serializer.validated_data['password']
            )
        if user is not None:
            if user.is2fa_active:
                user.otp_secret = generate_otp()
                user.otp_expires = timezone.now() + timedelta(minutes=5)
                user.save()
                send_otp_email(user)
                data = {
                    "2FA_required": True,
                    "message": "n otp message sent to your email to verify your account"
                }
                print('apiBackend ==> login status: user enabled 2FAC')
                return Response(data=data, status=status.HTTP_202_ACCEPTED)
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
                print('apiBackend ==> login status: login success')
                return response
            else:
                print('apiBackend ==> login status: Getting tokens for user failed')
                return Response({'error': 'Getting tokens for user failed'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        print('apiBackend ==> login status: Invalid credentials')
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)




        # except TokenError as e:
        #     print('--------error', e, '---------')

    #     print('------------------------')
    #     token = AccessToken(access_token)
    #     print('------------------------')
    #     expiration = token['exp']
    #     now = datetime.now(timezone.utc)
    #     if now > datetime.fromtimestamp(expiration, tz=timezone.utc):
    #         return False

    #     print('----------', expiration, '-----------')
    #     print('----------', access_token, '-------------')
    # # Try to authenticate using the access token from the cookie
    #     validated_token = self.get_validated_token(access_token)
    #     print('----------', validated_token, '-------------')

        # return self.get_user(validated_token), validated_token

# class RefreshToken(CreateAPIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request, *args, **kwargs):
#         refresh_token = request.COOKIES.get('refresh_token')
#         if refresh_token:
#             try:
#                 refresh = RefreshToken(refresh_token)
#                 if refresh:
#                     response = Response(data={''})
#                     access_token = refresh.access_token
#                 return Response(data={'access_token': str(access_token)}, status=status.HTTP_200_OK)
#             except Exception as err:
#                 return Response({'error': 'Invalid or expired refresh token', 'detail': err}, status=status.HTTP_401_UNAUTHORIZED)
#         return Response({'error': 'Refresh token missing'}, status=status.HTTP_400_BAD_REQUEST)


def get_token_for_user(user:User):

    refresh = RefreshToken.for_user(user)
    if refresh:
        return {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }
    return None

# @api_view(['POST'])
# @permission_classes([AllowAny])
# def login_view(request):
#     if request.method == 'POST':
#         serializer = UserLoginSerializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         user = authenticate(
#             username = serializer.validated_data['username'],
#             password = serializer.validated_data['password'])
#         if user is not None:
#             return Response(data=get_token_for_user(user),
#                                 status=status.HTTP_200_OK)
#         else:
#             return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)