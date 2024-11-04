from rest_framework import serializers

from accounts.serializers import UserSerializer
from matchmaker.models import Tournament


class TournamentSerializer(serializers.ModelSerializer):
    participants_count = serializers.SerializerMethodField()
    creator = UserSerializer()

    class Meta:
        model = Tournament
        fields = '__all__'
        read_only_fields = ['creator', 'is_full']
        # depth = 1

    def get_participants_count(self, obj):
        return obj.players.count()
