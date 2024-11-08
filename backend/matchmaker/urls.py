
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import TournamentViewSet, GameViewSet, CurrentUserViewSet

router = DefaultRouter()
router.register(r'tournaments', TournamentViewSet, basename='tournament')
router.register(r'games', GameViewSet, basename='game')
router.register(r'current-user', CurrentUserViewSet, basename='current-user')


urlpatterns = [
    path('', include(router.urls)),
]
