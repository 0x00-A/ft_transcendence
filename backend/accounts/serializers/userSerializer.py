from rest_framework import serializers
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework_simplejwt.tokens import Token
from ..models.user import User
from ..models.user import EmailVerification
from ..models.profile import Profile
from ..models.friends import FriendRequest
from ..models.BlockRelationship import BlockRelationship
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.core.files.base import ContentFile
from ..serializers import ProfileSerializer
from django.core.mail import send_mail
from django.conf import settings


def send_verification_email(user):
    token = EmailVerification.objects.create(user=user)
    verification_link = f'http://localhost:3000/auth/verify_email/{token.token}/'
    send_mail(
        'Verify your email',
        f'Click on the link to verify your email: {verification_link}',
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )


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
        user.is_active = False
        user.save()
        send_verification_email(user)
        return user


class TokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user: User) -> Token:
        token = super().get_token(user)
        token['user_id'] = user.pk
        token['username'] = user.username
        return token


class SetPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True, required=True, style={
                                     'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={
                                      'input_type': 'password'})

    def validate_password(self, value):
        try:
            validate_password(value)
        except DjangoValidationError as exc:
            raise serializers.ValidationError(str(exc))
        return value

    def validate(self, attrs):
        if not self.context['request']:
            raise serializers.ValidationError(
                {'error': 'Request is required'})
        user = self.context['request'].user
        if not user.is_oauth_user:
            raise serializers.ValidationError(
                {'error': 'Only oauth2 users can set password'})
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {'password': 'Passwords do not match'})
        return attrs

    def update(self, instance, validated_data):
        password = validated_data.pop('password')
        instance.set_password(password)
        instance.is_password_set = True
        instance.save()
        return instance


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
            if not user.is_active:
                raise serializers.ValidationError(
                    {'error': 'User is not active, Please verify your email and retry again!'})
        except User.DoesNotExist:
            raise serializers.ValidationError(
                {'username': 'username not exist'})
        return attrs


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    friend_request_status = serializers.CharField(required=False)
    friend_status = serializers.SerializerMethodField()
    # games = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'friend_status', 'username', 'first_name',
                  'last_name', 'profile', 'friend_request_status', 'last_seen', 'active_conversation', 'is_password_set', 'is2fa_active']

    def get_friend_status(self, obj):
        if 'request' not in self.context or self.context['request'].user == obj:
            return 'self'
        try:
            BlockRelationship.objects.get(
                blocker=self.context['request'].user, blocked=obj)
            print('-->>>-you are the blocker-<<--------')
            return 'Blocker'
        except BlockRelationship.DoesNotExist:
            try:
                BlockRelationship.objects.get(
                    blocker=obj, blocked=self.context['request'].user)
                print('-->>>-you are the blocked-<<--------')
                return 'Blocked'
            except BlockRelationship.DoesNotExist:
                pass
        try:
            as_sender = FriendRequest.objects.get(
                sender=self.context['request'].user, receiver=obj)
            print('---as sender-->>', as_sender.status, '<<--------')
            if as_sender.status == 'accepted':
                return 'Friends'
            if as_sender.status == 'pending':
                return 'Cancel'
            if as_sender.status == 'rejected':
                return 'Add'
            return as_sender.status
        except FriendRequest.DoesNotExist:
            try:
                as_reciever = FriendRequest.objects.get(
                    sender=obj, receiver=self.context['request'].user)
                print('---as reciever-->>', as_reciever.status, '<<--------')
                if as_reciever.status == 'accepted':
                    return 'Friends'
                if as_reciever.status == 'pending':
                    return 'Accept'
                if as_reciever.status == 'rejected':
                    return 'Add'
                return as_reciever.status
            except FriendRequest.DoesNotExist:
                return 'Add'
            # print('---as reciever-->>', as_reciever.status, '<<--------')
        return None
    # def get_games(self, obj):
    #     games_as_player1 = obj.games_as_player1.all()
    #     games_as_player2 = obj.games_as_player2.all()

    #     all_games = (games_as_player1 | games_as_player2).order_by('-start_time')
    #     last_5_games = all_games[:5]

    #     return GameSerializer(last_5_games, many=True).data
