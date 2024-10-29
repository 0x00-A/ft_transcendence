from rest_framework import serializers
from ..models import FriendRequest
from .profileSerialzer import ProfileSerializer



class FriendRequestSerializer(serializers.ModelSerializer):
    sender = ProfileSerializer()
    receiver = ProfileSerializer() 
    class Meta:
        model = FriendRequest
        fields = ['id', 'receiver', 'sender', 'status', 'timestamp']
