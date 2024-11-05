
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from matchmaker.views import GameViewSet

from .views import TournamentViewSet

router = DefaultRouter()
router.register(r'tournaments', TournamentViewSet, basename='tournament')
router.register(r'games', GameViewSet, basename='game')

urlpatterns = [
    path('', include(router.urls)),
]
