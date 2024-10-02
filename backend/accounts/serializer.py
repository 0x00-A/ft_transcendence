from rest_framework import serializers
from .models import User

class UserSerializer(serializer.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']