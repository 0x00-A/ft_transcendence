# serializers.py
from rest_framework import serializers
from matchmaker.models import Game

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ['id', 'player1', 'player2',
                  'p1_score', 'p2_score', 'status', 'winner', 'start_time']
