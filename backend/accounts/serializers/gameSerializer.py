from rest_framework import serializers
from django.db.models import Q
from ..models.game import Game

class GameSerializer(serializers.Serializer):
    class Meta:
        model = Game
        fields = ['game_date', 'winner', 'loser', 'winner_score', 'loser_score']


class PlayedGamesField(serializers.Field):
    def to_representation(self, profile):
        games_won = Game.objects.filter(winner=profile.id)
        games_lost = Game.objects.filter(loser=profile.id)
        games = games_won | games_lost

        return GameSerializer(games, many=True).data