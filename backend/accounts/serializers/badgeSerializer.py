from rest_framework import serializers
from ..models import Badge
from app.settings import MEDIA_URL
from app.settings import SERVER_URL

class BadgeSerializer(serializers.ModelSerializer):
    icon = serializers.SerializerMethodField()
    class Meta:
        model = Badge
        fields = ['id', 'name', 'icon', 'xp_reward', 'level_required']

    def get_icon(self, obj):
        return f"{SERVER_URL}{MEDIA_URL}{obj.icon}"