from rest_framework import serializers
from ..models.profile import Profile
from .gameSerializer import PlayedGamesField


class ProfileSerializer(serializers.ModelSerializer):

    username = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()
    games = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ['id', 'username', 'avatar', 'level', 'stats', 'is_online', 'games']

    def get_avatar(self, obj):
        return f"http://localhost:8000/media/{obj.avatar}"

    def get_username(self, obj):
        return obj.user.username

    def get_games(self, obj):
        pass
