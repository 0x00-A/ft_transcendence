from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from ..models import FriendRequest, Profile
from ..serializers import FriendRequestSerializer, ProfileSerializer


class UserFriendsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            profile = Profile.objects.select_related('user').get(user=request.user)
            friends = profile.friends.select_related('user').all()
            serializer = ProfileSerializer(friends, many=True)
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
            sender_profile = Profile.objects.select_related('user').get(user=request.user)
            receiver = Profile.objects.select_related('user').get(user__username=username)

            # Check if trying to send request to self
            if sender_profile == receiver:
                return Response(
                    {'error': 'Cannot send friend request to yourself'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Check if already friends
            if receiver in sender_profile.friends.all():
                return Response(
                    {'error': 'Already friends with this user'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Create friend request
            friend_request, created = FriendRequest.objects.get_or_create(
                sender=sender_profile,
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

        except Profile.DoesNotExist:
            return Response(
                {'error': 'Profile does not exist'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception:
            return Response(
                {'error': 'Internal server error'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class AcceptFriendRequestView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FriendRequestSerializer

    def post(self, request, username):
        try:
            receiver_profile = Profile.objects.select_related('user').get(user=request.user)
            sender_profile = Profile.objects.select_related('user').get(user__username=username)
            
            friend_request = FriendRequest.objects.get(sender=sender_profile, receiver=receiver_profile, status='pending')
            # Update request status
            friend_request.status = 'accepted'
            friend_request.save()

            # Add as friends (symmetrical)
            receiver_profile.friends.add(sender_profile)

            return Response({"message": "Friend request accepted"}, status=status.HTTP_200_OK)

        except Profile.DoesNotExist:
            return Response(
                {'error': 'Profile does not exist'}, 
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

    def post(self, request, username):
        try:
            receiver_profile = Profile.objects.select_related('user').get(user=request.user)
            sender_profile = Profile.objects.select_related('user').get(user__username=username)
            
            friend_request = FriendRequest.objects.get(
                sender=sender_profile,
                receiver=receiver_profile,
                status='pending'
            )

            friend_request.status = 'rejected'
            friend_request.save()

            return Response({"message": "Friend request rejected"}, status=status.HTTP_200_OK)

        except Profile.DoesNotExist:
            return Response(
                {'error': 'Profile does not exist'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except FriendRequest.DoesNotExist:
            return Response(
                {'error': 'Friend request does not exist or is not pending'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception :
            return Response(
                {'error': 'Internal server error'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SentFriendRequestsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            sent_requests = FriendRequest.objects.select_related(
                'sender__user', 
                'receiver__user'
            ).filter(
                sender__user=request.user,
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

    def get(self, request):
        try:
            pending_requests = FriendRequest.objects.select_related(
                'sender__user',
                'receiver__user'
            ).filter(
                receiver__user=request.user,
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
    
    def delete(self, request, username):
        try:
            receiver = Profile.objects.select_related('user').get(user__username=username)
            friend_request = FriendRequest.objects.get(
                sender__user=request.user,
                receiver=receiver,
                status='pending'
            )
            friend_request.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
            
        except (Profile.DoesNotExist, FriendRequest.DoesNotExist):
            return Response(
                {'error': 'Request not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': 'Internal server error'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
