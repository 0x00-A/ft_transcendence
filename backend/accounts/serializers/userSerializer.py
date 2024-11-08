from rest_framework import serializers
from django.core.exceptions import ValidationError as DjangoValidationError
from matchmaker.serializers.GameSerializer import GameSerializer
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

    def validate(self, attrs):
        if len(attrs['username']) < 4:
            raise serializers.ValidationError(
                {'username': 'Username must be at least 4 characters!'})
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
        # user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        # profile = Profile.objects.create(user=user)
        # profile.save()
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


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    games = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_oauth_user',
                  'first_name', 'last_name', 'profile', 'games']

    def get_games(self, obj):
        games_as_player1 = obj.games_as_player1.all()
        games_as_player2 = obj.games_as_player2.all()

        all_games = games_as_player1 | games_as_player2

        return GameSerializer(all_games, many=True).data
