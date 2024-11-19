# serializers.py
from rest_framework import serializers
from matchmaker.models import Game
from accounts.serializers.userSerializer import UserSerializer


class GameSerializer(serializers.ModelSerializer):
    player1 = UserSerializer()
    player2 = UserSerializer()
    winner = UserSerializer()

    class Meta:
        model = Game
        fields = ['id', 'player1', 'player2',
                  'p1_score', 'p2_score', 'status', 'winner', 'start_time']
