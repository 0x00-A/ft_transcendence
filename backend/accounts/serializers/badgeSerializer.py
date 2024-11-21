from rest_framework import serializers
from ..models import Badge

class BadgeSerializer(serializers.ModelSerializer):
    icon = serializers.SerializerMethodField()
    class Meta:
        model = Badge
        fields = ['id', 'name', 'icon', 'xp_reward', 'level_required']

    def get_icon(self, obj):
        return f"http://localhost:8000/media/{obj.icon}"