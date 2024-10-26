from rest_framework import serializers
from django.core.files.base import ContentFile
import requests
from ..models import User
from ..models import Profile

class Oauth2UserSerializer(serializers.ModelSerializer):

    # provider_id = serializers.IntegerField()
    # provider_name = serializers.CharField()
    # username = serializers.CharField()
    # email = serializers.EmailField()
    avatar_link = serializers.CharField()

    class Meta:
        model = User
        fields = ['username', 'email', 'avatar_link']

    def validate(self, attrs):
        return attrs

    def get_avatar_content(self, avatar_link):
        try:
            res = requests.get(avatar_link)
            res.raise_for_status()
            return res.content
        except requests.exceptions.HTTPError as err:
            print('-->', err)
            return None
        except Exception as err:
            print('-->', err)
            return None

    def create(self, validated_data):
        user = User.objects.create(
            username = validated_data['username'],
            email = validated_data['email'],
            is_oauth_user = True
        )
        user.set_unusable_password()
        user.save()
        profile = Profile.objects.create(user=user)
        avatarContent = self.get_avatar_content(validated_data['avatar_link'])
        if avatarContent is not None:
            profile.avatar.save(name=f"{user.username}_avatar.png", content=ContentFile(avatarContent), save=True)
        profile.save()
        return user
