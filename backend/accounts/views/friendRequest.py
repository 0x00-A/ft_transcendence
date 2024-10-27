from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from ..models import FriendRequest, Profile
from ..serializers import FriendRequestSerializer, ProfileSerializer


class UserFriendsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = Profile.objects.get(user=request.user)
        friends = profile.friends.all()
        serializer = ProfileSerializer(friends, many=True)
        return Response(serializer.data)


class SendFriendRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, username):
        try:
            receiver = Profile.objects.get(user__username=username)
        except Profile.DoesNotExist:
            return Response(data={'error': 'profile does not exist'}, status=status.HTTP_400_BAD_REQUEST)

        sender_profile = Profile.objects.get(user=request.user)
        friend_request, created = FriendRequest.objects.get_or_create(sender=sender_profile, receiver=receiver)
        if not created:
            return Response({"message": "Friend request already sent"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = FriendRequestSerializer(friend_request)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AcceptFriendRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, username):
        receiver_profile = Profile.objects.get(user=request.user)
        
        try:
            sender_profile = Profile.objects.get(user__username=username)
            friend_request = FriendRequest.objects.get(sender=sender_profile, receiver=receiver_profile, status='pending')
        except Profile.DoesNotExist:
            return Response({'error': 'Sender profile does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        except FriendRequest.DoesNotExist:
            return Response({'error': 'Friend request does not exist or is not pending'}, status=status.HTTP_400_BAD_REQUEST)

        friend_request.status = 'accepted'
        friend_request.save()

        receiver_profile.friends.add(sender_profile)
        sender_profile.friends.add(receiver_profile)

        return Response({"message": "Friend request accepted"}, status=status.HTTP_200_OK)




class RejectFriendRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, username):
        receiver_profile = Profile.objects.get(user=request.user)
        
        try:
            sender_profile = Profile.objects.get(user__username=username)
            friend_request = FriendRequest.objects.get(sender=sender_profile, receiver=receiver_profile, status='pending')
        except Profile.DoesNotExist:
            return Response({'error': 'Sender profile does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        except FriendRequest.DoesNotExist:
            return Response({'error': 'Friend request does not exist or is not pending'}, status=status.HTTP_400_BAD_REQUEST)

        # Reject friend request
        friend_request.status = 'rejected'
        friend_request.save()

        return Response({"message": "Friend request rejected"}, status=status.HTTP_200_OK)


class PendingFriendRequestsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        pending_requests = FriendRequest.objects.filter(receiver=request.user, status='pending')
        serializer = FriendRequestSerializer(pending_requests, many=True)
        return Response(serializer.data)
