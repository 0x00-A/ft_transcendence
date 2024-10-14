from rest_framework import serializers
from rest_framework_simplejwt.tokens import Token
from .models.user import User
from .models.profile import Profile
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# class UserSerializer(serializers.ModelSerializer):

#     password2 = serializers.CharField(write_only=True, required=True)

#     class Meta:
#         model = User
#         fields = ['username', 'email', 'password', 'password2']

#     def validate(self, attrs):
#         if attrs['password'] != attrs['password2']:
#             raise serializers.ValidationError('Passwords does not match')
#         return attrs

#     def create(self, validated_data):
#         validated_data.pop('password2')
#         password = validated_data.pop('password')
#         user = User.objects.create(**validated_data)
#         user.set_password(password)
#         user.save()
#         return user

# class ProfileSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Profile
#         fields = ['avatar', 'age', 'level']


class UserLoginSerializer(serializers.ModelSerializer):

    username = serializers.CharField(max_length=255)

    class Meta:
        model = User
        fields = ['username', 'password']


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['avatar', 'age', 'level']

    def validate(self, attrs):
        return super().validate(attrs)

    def create(self, validated_data):

        return super().create(validated_data)


class TokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user) -> Token:
        token = super().get_token(user)
        token['id'] = user.id
        token['username'] = user.username

        return token


class RegisterProfile(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['user', 'avatar', 'age', 'level']
