# serializers.py
from rest_framework import serializers
from matchmaker.models import Game

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ['id', 'player1', 'player2', 'p1_score', 'p2_score', 'status', 'winner', 'start_time']


class ProfileGamesSerializer(serializers.ModelSerializer):

    game_duration = serializers.SerializerMethodField()
    result = serializers.SerializerMethodField()
    score = serializers.SerializerMethodField()
    opponent = serializers.SerializerMethodField()

    class Meta:
        model = Game
        fields = ['id', 'start_time', 'opponent', 'result', 'score', 'game_duration']

    def get_opponenet(self, obj):
        if obj.player1 == self.context['request'].user:
            return obj.player2.username
        return obj.player1.username

    def get_result(self, obj):
        if obj.winner == self.context['request'].user:
            return 'Win'
        return 'Lose'

    def get_score(self, obj):
        return f'{obj.p1_score} - {obj.p2_score}'

    def get_game_duration(self, obj):
        return obj.end_time - obj.start_time
