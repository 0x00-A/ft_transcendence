from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import SignupView
from .views import LoginView
from .views import LogoutView
from .views import discord_authorize
from .views import oauth2_discord
from .views import intra_authorize
from .views import oauth2_intra
from .views import google_authorize
from .views import oauth2_google
from .views import oauth2_set_username
from .views import SendFriendRequestView
from .views import AcceptFriendRequestView
from .views import RejectFriendRequestView
from .views import PendingFriendRequestsView
from .views import UserFriendsView
from .views import SentFriendRequestsView
from .views import CancelFriendRequestView
from .views import OnlineFriendsView
from .views import AllUsersView
from .views import BlockedUsersView
from .views import BlockUserView
from .views import UnblockUserView
from .views import SuggestedConnectionsView
from .views import ConfirmOauth2Login
from .views import ProfileApiView



urlpatterns = [
    # path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/signup/', SignupView.as_view()),
    path('auth/login/', LoginView.as_view()),
    path('auth/logout/', LogoutView.as_view()),
    path('auth/confirm_login/', ConfirmOauth2Login.as_view()),

    # path('auth/refresh_token/', RefreshToken.as_view()),
    path('oauth2/verify_login', ConfirmOauth2Login.as_view()),
    path('oauth2/set_username/', oauth2_set_username),
    path('oauth2/discord/authorize/', discord_authorize),
    path('oauth2/discord/', oauth2_discord),
    path('oauth2/intra/authorize/', intra_authorize),
    path('oauth2/intra/', oauth2_intra),
    path('oauth2/google/authorize/', google_authorize),
    path('oauth2/google/', oauth2_google),

    path('users/', AllUsersView.as_view(), name='all_users'),
    path('profile/', ProfileApiView.as_view(), name='profile'),
    path('friends/', UserFriendsView.as_view(), name='user-friends'),
    path('suggested-connections/', SuggestedConnectionsView.as_view(), name='suggested-connections'),
    path('friends/online/', OnlineFriendsView.as_view(), name='online-friends'),
    path('friend-request/send/<str:username>/', SendFriendRequestView.as_view(), name='send-friend-request'),
    path('friend-request/accept/<str:username>/', AcceptFriendRequestView.as_view(), name='accept-friend-request'),
    path('friend-request/reject/<str:username>/', RejectFriendRequestView.as_view(), name='reject-friend-request'),
    path('friend-requests/pending/', PendingFriendRequestsView.as_view(), name='pending-friend-requests'),
    path('friend-requests/sent/', SentFriendRequestsView.as_view(), name='friend-request-list'),
    path('friend-request/cancel/<str:username>/', CancelFriendRequestView.as_view(), name='cancel-friend-request'),

    path('block/<str:username>/', BlockUserView.as_view(), name='block_user'),
    path('unblock/<str:username>/', UnblockUserView.as_view(), name='unblock_user'),
    path('blocked/', BlockedUsersView.as_view(), name='blocked_users'),
]
