# views.py
from rest_framework.response import Response
from rest_framework import viewsets, permissions
from matchmaker.models import Game
from matchmaker.serializers import GameSerializer
from matchmaker.serializers.GameSerializer import ProfileGamesSerializer
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.renderers import JSONRenderer


class GameViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = GameSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Game.objects.filter(player1=user) | Game.objects.filter(player2=user)



class ProfileGamesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        played_games = Game.objects.filter(player1=user) | Game.objects.filter(player2=user)
        serializer = ProfileGamesSerializer(played_games, many=True, context={'request': request})
        # all_games = (games_as_player1 | games_as_player2).order_by('-start_time')
        # last_5_games = all_games[:5]
        return Response(data=serializer.data, status=status.HTTP_200_OK)


class LastGamesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            print('==> LastGamesView')
            user = request.user
            last_games = (Game.objects.filter(player1=user) | Game.objects.filter(player2=user)).order_by('-start_time')[:5]
            serializer = ProfileGamesSerializer(last_games, many=True, context={'request': request})
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        except:
            return Response(data={"error": "No games found"}, status=status.HTTP_404_NOT_FOUND)