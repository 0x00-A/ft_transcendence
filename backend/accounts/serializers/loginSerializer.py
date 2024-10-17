from rest_framework import serializers
from django.core.files.base import ContentFile
from django.contrib.auth.password_validation import validate_password
from ..models import User
from ..models import Profile





class OauthUserRegister(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['username']

    def validate(self, attrs):

        return attrs

    def create(self, validated_data):
        user, created = User.objects.get_or_create(
            username = validated_data['username']
        )
        if created:
            # user = User.objects.create(username=validated_data['username'])
            user.is_oauth_user = True
            user.set_unusable_password()
            user.save()
            profile = Profile.objects.create(user=user)
            profile.avatar.save(content=ContentFile(validate_password['content']))
        if not created:
            if not user.is_oauth_user: