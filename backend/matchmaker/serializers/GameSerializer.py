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
        fields = ['id', 'player1', 'player2', 'p1_score', 'p2_score', 'status', 'winner', 'start_time']


class ProfileGamesSerializer(serializers.ModelSerializer):

    game_duration = serializers.SerializerMethodField()
    result = serializers.SerializerMethodField()
    score = serializers.SerializerMethodField()
    opponent_avatar = serializers.SerializerMethodField()
    opponent_username = serializers.SerializerMethodField()


    class Meta:
        model = Game
        fields = ['id', 'start_time', 'opponent_username', 'opponent_avatar', 'result', 'score', 'game_duration']

    def validate(self, data):
        print(f'Validating data: {data}')
        return data

    def get_opponent_username(self, obj):
        if obj.player1 == self.context['request'].user:
            return obj.player2.username
        return obj.player1.username

    def get_opponent_avatar(self, obj):
        if obj.player1 == self.context['request'].user:
            return f"http://localhost:8000/media/{obj.player2.profile.avatar}"
        return f"http://localhost:8000/media/{obj.player1.profile.avatar}"

    def get_result(self, obj):
        if obj.winner == self.context['request'].user:
            return 'Win'
        return 'Lose'

    def get_score(self, obj):
        return f'{obj.p1_score} - {obj.p2_score}'

    def get_game_duration(self, obj):
        if not obj.end_time or not obj.start_time:
            return None
        return obj.end_time - obj.start_time
