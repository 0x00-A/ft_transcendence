from rest_framework import permissions
from rest_framework import renderers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets
from matchmaker.models import Tournament
from matchmaker.serializers import TournamentSerializer


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

    # def perform_create(self, serializer):
    #     # Automatically set the creator as the user making the request
    #     serializer.save(creator=self.request.user)

    # def get_queryset(self):
    #     # Only list tournaments that are not full
    #     return Tournament.objects.filter(is_full=False)
