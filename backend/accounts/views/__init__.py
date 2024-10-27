from .login import LoginView
from .signup import SignupView
from .oauth2_discord import discord_authorize
from .oauth2_discord import oauth2_discord
from .ouath2_intra import intra_authorize
from .ouath2_intra import oauth2_intra
from .ouath2_google import google_authorize
from .ouath2_google import oauth2_google
from .oauth2_utils import get_oauth2_user
from .oauth2_utils import exchange_code
from .oauth2_utils import oauth2_set_username
from .friendRequest import SendFriendRequestView
from .friendRequest import AcceptFriendRequestView
from .friendRequest import RejectFriendRequestView
from .friendRequest import PendingFriendRequestsView
from .friendRequest import UserFriendsView
from .friendRequest import SentFriendRequestsView
from .friendRequest import CancelFriendRequestView
from .profile import AllUsersView

# from .profile import ProfileModelViewSet