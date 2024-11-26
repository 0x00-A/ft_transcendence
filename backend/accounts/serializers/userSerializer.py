from rest_framework import serializers
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework_simplejwt.tokens import Token
from ..models.user import User
from ..models.profile import Profile
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.core.files.base import ContentFile
from ..serializers import ProfileSerializer


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={
                                    'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={
                                    'input_type': 'password'})

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2']

    def validate_password(self, value):
        try:
            validate_password(value)
        except DjangoValidationError as exc:
            raise serializers.ValidationError(str(exc))
        return value

    def validate_username(self, value):
        if any(ch.isupper() for ch in value):
            raise serializers.ValidationError(
                {'Username must be lowercase!'})
        if len(value) < 4:
            raise serializers.ValidationError(
                {'Username must be at least 4 characters!'})
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {'password': 'Passwords do not match'})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        user, created = User.objects.get_or_create(**validated_data)
        if not created:
            raise serializers.ValidationError('User already exist!')
        user.set_password(password)
        user.save()
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

    def validate(self, attrs):
        try:
            user = User.objects.get(username=attrs['username'])
            if (not user.check_password(attrs['password'])):
                raise serializers.ValidationError(
                    {'password': 'password not valid'})
        except User.DoesNotExist:
            raise serializers.ValidationError(
                {'username': 'username not exist'})
        return attrs


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    friend_request_status = serializers.CharField(required=False)
    # games = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name',
                'last_name', 'profile', 'friend_request_status', 'last_seen', 'active_conversation']

    # def get_games(self, obj):
    #     games_as_player1 = obj.games_as_player1.all()
    #     games_as_player2 = obj.games_as_player2.all()

    #     all_games = (games_as_player1 | games_as_player2).order_by('-start_time')
    #     last_5_games = all_games[:5]

    #     return GameSerializer(last_5_games, many=True).data
