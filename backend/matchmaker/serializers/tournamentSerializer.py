from rest_framework import serializers

from matchmaker.models import Tournament


class TournamentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = '__all__'
        read_only_fields = ['creator', 'is_full']
        depth = 1
