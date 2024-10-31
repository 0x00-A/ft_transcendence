# views.py
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

class AllUsersView(APIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            users = User.objects.exclude(username=request.user.username)
            user_data_with_status = []
            for user in users:
                user_data = UserSerializer(user).data
                try:
                    friend_request = FriendRequest.objects.filter(
                        Q(sender=request.user, receiver=user) | Q(sender=user, receiver=request.user)
                    ).first()

                    if friend_request:
                        user_data['friend_request_status'] = friend_request.status
                    else:
                        user_data['friend_request_status'] = 'Add Friend'
                except FriendRequest.DoesNotExist:
                    user_data['friend_request_status'] = 'Add Friend'
                user_data_with_status.append(user_data)
            return Response(user_data_with_status, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response(
                {'error': 'User profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception:
            return Response(
                {'error': 'Internal server error'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )