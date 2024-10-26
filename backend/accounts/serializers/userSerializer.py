from rest_framework import serializers
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework_simplejwt.tokens import Token
from ..models.user import User
from ..models.profile import Profile
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.core.files.base import ContentFile


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type':'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type':'password'})

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2']

    def validate_password(self, value):
        try:
            validate_password(value)
        except DjangoValidationError as exc:
            raise serializers.ValidationError(str(exc))
        return value

    def validate(self, attrs):
        if len(attrs['username']) < 4:
            raise serializers.ValidationError('Username must be at least 4 characters!')
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError('Passwords does not match')
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        profile = Profile.objects.create(user=user)
        profile.save()
        return user

class TokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user: User) -> Token:
        token = super().get_token(user)
        token['user_id'] = user.pk
        token['username'] = user.username
        return token

class UserLoginSerializer(serializers.ModelSerializer):

    username = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['username', 'password']

    # def validate(self, attrs):
    #     try:
    #         User.objects.get(username=attrs['username'])
    #     except User.DoesNotExist:
    #         raise serializers.ValidationError('username not exists!')
    #     return attrs
