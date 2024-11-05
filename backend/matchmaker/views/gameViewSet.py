# views.py
from rest_framework import viewsets, permissions
from matchmaker.models import Game
from matchmaker.serializers import GameSerializer


class GameViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = GameSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Game.objects.filter(player1=user) | Game.objects.filter(player2=user)
