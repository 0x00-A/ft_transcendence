from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from ..models import BlockRelationship, FriendRequest
from ..serializers.BlockedUserSerializer import BlockedUserSerializer
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.db.models import Q

User = get_user_model()

class BlockUserView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, username):
        try:
            target_user = User.objects.get(username=username)

            if not request.user.friends.filter(username=target_user.username).exists():
                return Response({'error': 'You can only block friends'}, status=status.HTTP_400_BAD_REQUEST)

            block_relationship, created = BlockRelationship.objects.get_or_create(
                blocker=request.user,
                blocked=target_user,
                defaults={'date_blocked': timezone.now()}
            )

            if created:
                request.user.friends.remove(target_user)
                FriendRequest.objects.filter(
                    Q(sender=request.user, receiver=target_user) | 
                    Q(sender=target_user, receiver=request.user)
                ).delete()
                return Response({'message': 'User blocked and removed from friends'}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'User is already blocked'}, status=status.HTTP_400_BAD_REQUEST)

        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception:
            return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

class UnblockUserView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, username):
        try:
            target_user = User.objects.get(username=username)
            deleted_count, _ = BlockRelationship.objects.filter(blocker=request.user, blocked=target_user).delete()
            if deleted_count > 0:
                return Response({'message': 'User unblocked'}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'User is not blocked'}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception:
            return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class BlockedUsersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            blocked_relationships = BlockRelationship.objects.filter(blocker=request.user).select_related('blocked')
            serializer = BlockedUserSerializer(blocked_relationships, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
