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
            serializer = UserSerializer(user)
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
        print('REQUEST:', request.data)
        serializer = EditProfileSerializer(
            user, data=request.data, partial=True)
        if request.FILES:
            print('FILES:', request.FILES)
            serializer.files = request.FILES
        if serializer.is_valid():
            serializer.save()
            print('api ==> edit profile: Changes apply to your profile successfuly')
            return Response({'message: changes apply to your profile successfuly'}, status=status.HTTP_200_OK)
        print('api ==> edit profile: Failed to apply Changes to your profile')
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
