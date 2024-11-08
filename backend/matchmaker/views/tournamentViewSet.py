from rest_framework import permissions
from rest_framework import renderers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets
from matchmaker.models import Tournament
from matchmaker.serializers import TournamentSerializer

from django.shortcuts import get_object_or_404


class TournamentViewSet(viewsets.ReadOnlyModelViewSet):
    """
    This ViewSet automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.

    Additionally we also provide an extra `highlight` action.
    """
    # queryset = Tournament.objects.all()
    queryset = Tournament.objects.filter(is_full=False).order_by('-created_at')
    serializer_class = TournamentSerializer
    permission_classes = [permissions.IsAuthenticated]
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly,
    #                       IsOwnerOrReadOnly]

    def get_serializer_context(self):
        # Add user_id to the context, which can be accessed in the serializer
        context = super().get_serializer_context()
        context['user_id'] = self.request.user.id
        return context

    @action(detail=False, methods=['get'], url_path='user-tournament')
    def get_user_tournament(self, request):
        # Retrieve the tournament where the current user is a player and it hasn't ended
        tournament = Tournament.objects.exclude(
            status='ended').filter(players=request.user).first()

        if tournament:
            serializer = self.get_serializer(tournament)
            return Response(serializer.data)
        else:
            return Response({"detail": "No active tournament found."})

    # def perform_create(self, serializer):
    #     # Automatically set the creator as the user making the request
    #     serializer.save(creator=self.request.user)

    # def get_queryset(self):
    #     # Only list tournaments that are not full
    #     return Tournament.objects.filter(is_full=False)
