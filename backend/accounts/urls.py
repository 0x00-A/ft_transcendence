from django.urls import path
from .views import SignupView
from .views import LoginView
from .views import discord_authorize
from .views import oauth2_discord


urlpatterns = [
    path('auth/signup/', SignupView.as_view()),
    path('auth/login/', LoginView.as_view()),
    path('oauth2/discord/authorize/', discord_authorize),
    path('oauth2/discord/', oauth2_discord),
]
