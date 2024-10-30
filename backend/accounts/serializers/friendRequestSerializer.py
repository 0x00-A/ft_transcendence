from accounts.serializers.userSerializer import UserSerializer
from rest_framework import serializers
from ..models import FriendRequest

from django.contrib.auth import get_user_model

User = get_user_model()


class FriendRequestSerializer(serializers.ModelSerializer):
    sender = UserSerializer()
    receiver = UserSerializer() 
    class Meta:
        model = FriendRequest
        fields = ['id', 'receiver', 'sender', 'status', 'timestamp']
