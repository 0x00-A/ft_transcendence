from rest_framework import serializers
from ..models.profile import Profile, User
from ..serializers.badgeSerializer import BadgeSerializer



class ProfileSerializer(serializers.ModelSerializer):

    username = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()
    badge = BadgeSerializer()

    class Meta:
        model = Profile
        fields = ['id', 'username', 'avatar', 'level', 'score', 'rank', 'badge', 'stats', 'is_online']

    def get_avatar(self, obj):
        return f"http://localhost:8000/media/{obj.avatar}"

    def get_username(self, obj):
        return obj.user.username


class EditProfileSerializer(serializers.ModelSerializer):
    # username = serializers.CharField(required=False)
    avatar = serializers.ImageField(required=False)

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'avatar', 'password']

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
            raise serializers.ValidationError({'password': 'Password is required to update your informations!'})
        print('-----context--->>', self.context['request'].user, '<--------')
        user = self.context['request'].user
        if not user.check_password(password):
            raise serializers.ValidationError({'password': 'Incorrect password!'})
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
        instance.save()
        return instance
