from accounts.serializers.userSerializer import UserSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from ..models import FriendRequest, Profile, BlockRelationship
from ..serializers import FriendRequestSerializer, ProfileSerializer
from django.contrib.auth import get_user_model
from accounts.consumers import NotificationConsumer
from rest_framework.permissions import AllowAny


User = get_user_model()

class MutualFriendsView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get(self, request, username):
        try:
            user = request.user
            otherUser = User.objects.get(username=username)

            mutual_friends = user.friends.filter(
                id__in=otherUser.friends.values_list('id', flat=True)
            ).select_related('profile')

            serializer = self.serializer_class(mutual_friends, many=True)

            response_data = {
                'mutual_friends_count': mutual_friends.count(),
                'mutual_friends': serializer.data,
                # 'target_user': {
                #     'username': otherUser.username,
                #     'id': otherUser.id
                # }
            }
            return Response(response_data, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response(
                {'error': 'User with this username does not exist'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': 'Internal server error'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class SuggestedConnectionsView(APIView):
    permission_classes = [AllowAny]
    serializer_class = FriendRequestSerializer

    def get(self, request):
        user = request.user

        mutual_friend_ids = User.objects.filter(friends__in=user.friends.all()).exclude(id=user.id).distinct()

        suggested_users = []
        for suggested_user in mutual_friend_ids:
            if suggested_user in user.friends.all():
                status = "Friends"
            elif FriendRequest.objects.filter(sender=user, receiver=suggested_user, status='pending').exists():
                status = "Pending"
            else:
                status = "Add Friend"

            suggested_users.append({
                "user": UserSerializer(suggested_user).data,
                "status": status
            })

        return Response(suggested_users)

class UserFriendsView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get(self, request, username=None):
        if username:

            try:
                user = User.objects.get(username=username)
                friends = user.friends.all()
                serializer = self.serializer_class(friends, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except User.DoesNotExist:
                return Response(
                    {'error': 'User does not exist'},
                    status=status.HTTP_404_NOT_FOUND
                )
            except Exception as e:
                return Response(
                    {'error': 'Internal server error'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        try:
            user = request.user
            friends = user.friends.all()
            serializer = self.serializer_class(friends, many=True)
            return Response(serializer.data)
        except Profile.DoesNotExist:
            return Response(
                {'error': 'User profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': 'Internal server error'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class OnlineFriendsView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get(self, request):
        try:
            user = request.user
            online_friends = user.friends.filter(profile__is_online=True)
            serializer = UserSerializer(online_friends, many=True)
            return Response(serializer.data)

        except Profile.DoesNotExist:
            return Response(
                {'error': 'User profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': 'Internal server error'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class SendFriendRequestView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FriendRequestSerializer

    def post(self, request, username):
        try:
            receiver = User.objects.get(username=username)
            sender_user = request.user

            if BlockRelationship.objects.filter(
                blocker=sender_user, blocked=receiver
            ).exists() or BlockRelationship.objects.filter(
                blocker=receiver, blocked=sender_user
            ).exists():
                return Response(
                    {'error': 'Cannot send friend request as one of the users has blocked the other'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if sender_user == receiver:
                return Response(
                    {'error': 'Cannot send friend request to yourself'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            if receiver in sender_user.friends.all():
                return Response(
                    {'error': 'Already friends with this user'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            friend_request, created = FriendRequest.objects.get_or_create(
                sender=sender_user,
                receiver=receiver,
                defaults={'status': 'pending'}
            )

            if not created:
                if friend_request.status == 'pending':
                    return Response(
                        {'error': 'Friend request already sent'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                elif friend_request.status == 'rejected':
                    return Response(
                        {'error': 'Friend request was rejected. Please send a new request.'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            if created:
                notification_data = {
                    'event': 'friend_request',
                    'from': sender_user.username,
                    'message': f'{sender_user.username} has sent you a friend request!'
                }
                NotificationConsumer.send_notification_to_user(receiver.id, notification_data)
                return Response({'message': 'Friend request sent successfully'},
                        status=status.HTTP_201_CREATED)

        except User.DoesNotExist:
            return Response(
                {'error': 'User with this username does not exist'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': 'Internal server error'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class AcceptFriendRequestView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FriendRequestSerializer

    def post(self, request, username):
        try:
            sender_user = User.objects.get(username=username)
            receiver = request.user

            friend_request = FriendRequest.objects.get(sender=sender_user, receiver=receiver, status='pending')
            # Update request status
            friend_request.status = 'accepted'
            friend_request.save()
            friend_request.refresh_from_db()

            receiver.friends.add(sender_user)
            notification_data = {
                'event': 'friend_request_accepted',
                'from': receiver.username,
                'message': f'{receiver.username} has accepted your friend request! You are now friends.'
            }
            NotificationConsumer.send_notification_to_user(sender_user.id, notification_data)

            return Response({"message": "Friend request accepted successfully"}, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response(
                {'error': 'User does not exist'},
                status=status.HTTP_404_NOT_FOUND
            )
        except FriendRequest.DoesNotExist:
            return Response(
                {'error': 'Friend request does not exist or is not pending'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception:
            return Response(
                {'error': 'Internal server error'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class RejectFriendRequestView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FriendRequestSerializer

    def post(self, request, username):
        try:
            sender_user = User.objects.get(username=username)
            receiver_user = request.user

            # Fetch pending friend request
            friend_request = FriendRequest.objects.get(
                sender=sender_user,
                receiver=receiver_user,
                status='pending'
            )
            friend_request.delete()
            return Response({"message": "Friend request rejected"}, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response(
                {'error': 'User does not exist'},
                status=status.HTTP_404_NOT_FOUND
            )
        except FriendRequest.DoesNotExist:
            return Response(
                {'error': 'Friend request does not exist or is not pending'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception:
            return Response(
                {'error': 'Internal server error'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SentFriendRequestsView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FriendRequestSerializer

    def get(self, request):
        try:
            sent_requests = FriendRequest.objects.filter(
                sender=request.user,
                status='pending'
            )
            serializer = FriendRequestSerializer(sent_requests, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'error': 'Internal server error'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class PendingFriendRequestsView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FriendRequestSerializer

    def get(self, request):
        try:
            pending_requests = FriendRequest.objects.filter(
                receiver=request.user,
                status='pending'
            )
            serializer = FriendRequestSerializer(pending_requests, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'error': 'Internal server error'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class CancelFriendRequestView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FriendRequestSerializer

    def delete(self, request, username):
        try:
            receiver_user = User.objects.get(username=username)
            friend_request = FriendRequest.objects.get(
                sender=request.user,
                receiver=receiver_user,
                status='pending'
            )
            friend_request.delete()
            return Response({"message": "Friend request cancel"}, status=status.HTTP_204_NO_CONTENT)

        except (User.DoesNotExist, FriendRequest.DoesNotExist):
            return Response(
                {'error': 'Request not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': 'Internal server error'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


