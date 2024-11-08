# views.py
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from accounts.serializers import UserSerializer
from accounts.models import User


class CurrentUserViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Return a queryset containing only the current authenticated user
        return User.objects.filter(id=self.request.user.id)
