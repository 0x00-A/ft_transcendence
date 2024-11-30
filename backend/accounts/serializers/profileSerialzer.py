from rest_framework import serializers
from ..models.profile import Profile, User
from ..serializers.badgeSerializer import BadgeSerializer
from app.settings import SERVER_URL, MEDIA_URL


class ProfileSerializer(serializers.ModelSerializer):

    username = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()
    badge = BadgeSerializer()

    class Meta:
        model = Profile
        fields = ['id', 'username', 'avatar', 'level', 'score',
                  'rank', 'badge', 'stats', 'is_online', 'blocked_user_name']

    def get_avatar(self, obj):
        return f"{SERVER_URL}{MEDIA_URL}{obj.avatar}"

    def get_username(self, obj):
        return obj.user.username


class EditProfileSerializer(serializers.ModelSerializer):
    # username = serializers.CharField(required=False)
    avatar = serializers.ImageField(required=False)
    removeAvatar = serializers.CharField(required=False)

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name',
                  'avatar', 'removeAvatar', 'password']

    def validate_username(self, value):
        if any(ch.isupper() for ch in value):
            raise serializers.ValidationError(
                {'Username must be lowercase!'})
        if len(value) < 4:
            raise serializers.ValidationError(
                {'Username must be at least 4 characters!'})
        return value

    def validate(self, attrs):
        print('----attr---->', attrs, '<--------')
        password = attrs.get('password')
        if password is None:
            raise serializers.ValidationError(
                {'password': 'Password is required to update your informations!'})
        print('-----context--->>', self.context['request'].user, '<--------')
        user = self.context['request'].user
        if not user.check_password(password):
            raise serializers.ValidationError(
                {'password': 'Incorrect password!'})
        return super().validate(attrs)

    def update(self, instance, validated_data):
        print('-------->', validated_data, '<--------')
        print('-------->', instance, '<--------')
        if 'username' in validated_data:
            instance.username = validated_data.get('username')
        if 'first_name' in validated_data:
            instance.first_name = validated_data.get('first_name')
        if 'last_name' in validated_data:
            instance.last_name = validated_data.get('last_name')
        if 'avatar' in validated_data:
            print('-------->>', validated_data.get('avatar'), '<<--------')
            instance.profile.avatar = validated_data.get('avatar')
        if 'removeAvatar' in validated_data:
            print('-------->>', validated_data.get('removeAvatar'), '<<--------')
            if validated_data.get('removeAvatar') == 'true':
                instance.profile.avatar = 'avatars/avatar.jpeg'
        instance.save()
        return instance
