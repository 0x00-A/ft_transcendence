from rest_framework import serializers
from .models.user import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        # def validate(self, data):
        #     if data['password'] != data['confirm_password']:
        #         return serializers.ValidationError('Passwords do not mutch')
        # def __str__(self) -> str:
        #     return self.username