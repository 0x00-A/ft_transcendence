from django.urls import path
from django.urls import re_path
from .views import OnlineUsersView
from .views import UserDetailView
from rest_framework_simplejwt.views import TokenRefreshView
from .views import SignupView
from .views import LoginView
from .views import oauth2_authentication
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
from rest_framework.routers import DefaultRouter
from accounts.views import NotificationViewSet
from .views import EditProfileView
from .views import ChangePasswordView
from .views import oauth2_authorize
from .views import UserProfileView
from .views import MutualFriendsView
from .views import Enable2FAView
from .views import VerifyOTPView
from .views import Disable2FAView
from .views import LoginVerifyOTPView
from .views import verify_email

router = DefaultRouter()
router.register(r'notifications', NotificationViewSet, basename='notification')


urlpatterns = [
    # path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/signup/', SignupView.as_view()),
    path('auth/verify_email/<uuid:token>/', verify_email),
    path('auth/login/', LoginView.as_view()),
    path('login/verify_otp/', LoginVerifyOTPView.as_view()),
    re_path(r'^auth/oauth2/(?P<choice>intra|discord|google)/$',
            oauth2_authentication, name='oauth2_authentication'),
    re_path(r'^auth/oauth2/authorize/(?P<choice>intra|discord|google)/$',
            oauth2_authorize, name='oauth2_authorize'),
    path('auth/confirm_login/', ConfirmOauth2Login.as_view()),
    path('oauth2/verify_login/', ConfirmOauth2Login.as_view()),
    path('auth/logout/', LogoutView.as_view()),
    path('security/enable_2fa/', Enable2FAView.as_view()),
    path('security/verify_otp/', VerifyOTPView.as_view()),
    path('security/disable_2fa/', Disable2FAView.as_view()),

    path('auth/new_username/', oauth2_set_username),
    # path('oauth2/discord/authorize/', discord_authorize),

    # path('auth/refresh_token/', RefreshToken.as_view()),
    # path('oauth2/discord/', oauth2_discord),
    # path('oauth2/intra/authorize/', intra_authorize),
    # path('oauth2/intra/', oauth2_intra),
    # path('oauth2/google/authorize/', google_authorize),
    # path('oauth2/google/', oauth2_google),

     path('users/', AllUsersView.as_view(), name='all_users'),
     path('users/<int:user_id>/', UserDetailView.as_view(), name='user-detail'),
     path('users/online/', OnlineUsersView.as_view(), name='online-users'),
     path('profile/', ProfileApiView.as_view(), name='profile'),
     path('profile/<str:username>/', UserProfileView.as_view(), name='user-profile'),
     path('edit/informations/', EditProfileView.as_view()),
     path('security/change_password/', ChangePasswordView.as_view()),
     path('friends/<str:username>/', UserFriendsView.as_view(), name='specific-user-friends'),
    path('friends/', UserFriendsView.as_view(), name='current-user-friends'),
    path('friends/mutual/<str:username>/', MutualFriendsView.as_view(), name='mutual-friends'),
    path('suggested-connections/', SuggestedConnectionsView.as_view(),
         name='suggested-connections'),
    path('friends/online/', OnlineFriendsView.as_view(), name='online-friends'),
    path('friend-request/send/<str:username>/',
         SendFriendRequestView.as_view(), name='send-friend-request'),
    path('friend-request/accept/<str:username>/',
         AcceptFriendRequestView.as_view(), name='accept-friend-request'),
    path('friend-request/reject/<str:username>/',
         RejectFriendRequestView.as_view(), name='reject-friend-request'),
    path('friend-requests/pending/', PendingFriendRequestsView.as_view(),
         name='pending-friend-requests'),
    path('friend-requests/sent/', SentFriendRequestsView.as_view(),
         name='friend-request-list'),
    path('friend-request/cancel/<str:username>/',
         CancelFriendRequestView.as_view(), name='cancel-friend-request'),

    path('block/<str:username>/', BlockUserView.as_view(), name='block_user'),
    path('unblock/<str:username>/', UnblockUserView.as_view(), name='unblock_user'),
    path('blocked/', BlockedUsersView.as_view(), name='blocked_users'),
    *router.urls,
]
