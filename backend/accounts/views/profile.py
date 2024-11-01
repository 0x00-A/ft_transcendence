from accounts.serializers.userSerializer import UserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from django.contrib.auth import get_user_model
from django.db.models import Q
User = get_user_model()
from ..models import Profile, FriendRequest
from ..serializers import ProfileSerializer

def get_friend_status(current_user, other_user):
    """Helper function to determine the friend request status between two users."""
    friend_request = FriendRequest.objects.filter(
        Q(sender=current_user, receiver=other_user) | Q(sender=other_user, receiver=current_user)
    ).first()
    
    if friend_request:
        if friend_request.status == 'accepted':
            return 'accepted'
        elif friend_request.receiver == current_user:
            return friend_request.status
        else:
            return 'cancel'
    return 'Add Friend'

class AllUsersView(APIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            users = User.objects.exclude(username=request.user.username)
            user_data_with_status = []
            
            for user in users:
                user_data = UserSerializer(user).data
                user_data['friend_request_status'] = get_friend_status(request.user, user)
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
