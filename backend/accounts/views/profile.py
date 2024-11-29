from accounts.serializers.userSerializer import UserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from django.contrib.auth import get_user_model
from django.db.models import Q
from ..models import Profile, FriendRequest
from ..serializers import UserSerializer
from ..serializers import EditProfileSerializer
from app.settings import MEDIA_URL
from app.settings import SERVER_URL


User = get_user_model()


def get_friend_status(current_user, other_user):
    """Helper function to determine the friend request status between two users."""
    friend_request = FriendRequest.objects.filter(
        Q(sender=current_user, receiver=other_user) | Q(
            sender=other_user, receiver=current_user)
    ).first()

    if friend_request:
        if friend_request.status == 'accepted':
            return 'accepted'
        elif friend_request.receiver == current_user:
            return friend_request.status
        else:
            return 'cancel'
    return 'Add Friend'


class ProfileApiView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get(self, request):
        try:
            user = request.user
            serializer = UserSerializer(user, context={'request': request})
            print('api ==> get profile: User profile found')
            return Response(serializer.data, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            print('api ==> get profile: User profile not found')
            return Response(
                {'error': 'User profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Internal server error: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
            serializer = UserSerializer(user, context={'request': request})
            if serializer.data['friend_status'] == 'Blocker':
                return Response(
                    {'message': 'You blocked this user, you cannot see his profile', 'status': 'Blocker'},
                    status=status.HTTP_200_OK
                )
            if serializer.data['friend_status'] == 'Blocked':
                return Response(
                    {'message': 'This user blocked you, you cannot see his profile', 'status': 'Blocked'},
                    status=status.HTTP_200_OK
                )
            print('api ==> get user profile: User profile found')
            return Response(serializer.data, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            print('api ==> get user profile: User profile not found')
            return Response(
                {'error': 'User profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Internal server error: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AllUsersView(APIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            users = User.objects.exclude(
                Q(blocked_users__blocked=request.user) | Q(
                    blockers__blocker=request.user)
            ).exclude(username=request.user.username)

            user_data_with_status = []
            for user in users:
                user_data = UserSerializer(user).data
                user_data['friend_request_status'] = get_friend_status(
                    request.user, user)
                user_data_with_status.append(user_data)

            return Response(user_data_with_status, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response(
                {'error': 'User profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Internal server error: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class UserDetailView(APIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)

            user_data = UserSerializer(user).data

            # # Optionally, add friend request status
            # user_data['friend_request_status'] = get_friend_status(
            #     request.user, user)

            return Response(user_data, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Internal server error: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class OnlineUsersView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            online_count = User.objects.filter(profile__is_online=True).count()
            return Response(
                {'online_players': online_count},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {'error': f'Internal server error: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class EditProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        print('--->>REQUEST DATA ==>: ', request.data, '<<---')

        serializer = EditProfileSerializer(user, context={'request': request}, data=request.data, partial=True)
        if request.FILES:
            print('FILES:', request.FILES)
            serializer.files = request.FILES
        if serializer.is_valid():
            serializer.save()
            print('api ==> edit profile: Changes apply to your profile successfuly')
            return Response({'message': 'Changes apply to your profile successfuly'}, status=status.HTTP_200_OK)
        print('api ==> edit profile: Failed to apply Changes to your profile')
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        print('--->>REQUEST DATA ==>: ', request.data, '<<---')

        if 'current_password' not in request.data or 'new_password' not in request.data or 'confirm_password' not in request.data:
            return Response(
                {'error': 'Please provide both current and new passwords'},
                status=status.HTTP_400_BAD_REQUEST
            )
        if not user.check_password(request.data['current_password']):
            return Response(
                {'error': 'Current password is incorrect'},
                status=status.HTTP_400_BAD_REQUEST
            )
        if request.data['new_password'] != request.data['confirm_password']:
            return Response(
                {'error': 'Passwords do not match'},
                status=status.HTTP_400_BAD_REQUEST
            )
        user.set_password(request.data['new_password'])
        user.save()
        print('api ==> change password: Password changed successfully')
        return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)


import pyotp
import qrcode

class VerifyOTPView(APIView):
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


class Enable2FAView(APIView):
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

# class UploadAvatarView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request):
#         try:
#             file = request.FILES.get('avatar')
#             if not file:
#                 return Response(
#                     {'error': 'Please provide an image file'},
#                     status=status.HTTP_400_BAD_REQUEST
#                 )
#             profile = Profile.objects.get(user=request.user)
#             profile.avatar = file
#             profile.save()
#             return Response({'message': 'Avatar uploaded successfully'}, status=status.HTTP_200_OK)

#         except Profile.DoesNotExist:
#             return Response(
#                 {'error': 'Profile not found'},
#                 status=status.HTTP_404_NOT_FOUND
#             )
#         except Exception as e:
#             return Response(
#                 {'error': f'Internal server error: {str(e)}'},
#                 status=status.HTTP_500_INTERNAL_SERVER_ERROR
