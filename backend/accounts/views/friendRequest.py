from accounts.serializers.userSerializer import UserSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from ..models import FriendRequest, Profile
from ..serializers import FriendRequestSerializer, ProfileSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


class UserFriendsView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProfileSerializer

    def get(self, request):
        try:
            user = request.user
            friends = user.friends.all()
            serializer = UserSerializer(friends, many=True)
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
    serializer_class = ProfileSerializer

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
            # Get sender and receiver profiles
            # sender_profile = Profile.objects.select_related('user').get(user=request.user)
            receiver = User.objects.get(username=username)
            sender_user = request.user


            # Check if trying to send request to self
            if sender_user == receiver:
                return Response(
                    {'error': 'Cannot send friend request to yourself'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Check if already friends
            if receiver in sender_user.friends.all():
                return Response(
                    {'error': 'Already friends with this user'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Create friend request
            print(f" ______________")

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
                    # Update existing rejected request to pending
                    friend_request.status = 'pending'
                    friend_request.save()
                    created = True

            if created:
                serializer = FriendRequestSerializer(friend_request)
                return Response(serializer.data, status=status.HTTP_201_CREATED)

        except User.DoesNotExist:
            return Response(
                {'error': 'Profile does not exist'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {f'error: Internal server error {e}'}, 
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

            # Add as friends (symmetrical)
            receiver.friends.add(sender_user)

            return Response({"message": "Friend request accepted"}, status=status.HTTP_200_OK)

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

            # Update request status to rejected
            friend_request.status = 'rejected'
            friend_request.save()

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
            return Response(status=status.HTTP_204_NO_CONTENT)

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
