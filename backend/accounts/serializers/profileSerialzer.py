from rest_framework import serializers
from ..models.profile import Profile


class ProfileSerializer(serializers.ModelSerializer):

    username = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ['id', 'username', 'full_name', 'avatar', 'level']

    def get_username(self, obj):
        return obj.user.username

    def get_full_name(self, obj):
        return obj.user.first_name + ' ' + obj.user.last_name
