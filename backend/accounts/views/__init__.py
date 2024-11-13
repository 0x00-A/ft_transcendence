from .login import LoginView
from .login import RefreshToken
from .logout import LogoutView
from .signup import SignupView
from .oauth2_authentication import oauth2_authentication

from .oauth2_discord import discord_authorize
from .oauth2_discord import oauth2_discord
from .ouath2_intra import intra_authorize
from .ouath2_intra import oauth2_intra
from .ouath2_google import google_authorize
from .ouath2_google import oauth2_google

from .oauth2_utils import get_oauth2_user
from .oauth2_utils import exchange_code
from .oauth2_utils import oauth2_set_username
from .oauth2_utils import ConfirmOauth2Login

from .friendRequest import SendFriendRequestView
from .friendRequest import AcceptFriendRequestView
from .friendRequest import RejectFriendRequestView
from .friendRequest import PendingFriendRequestsView
from .friendRequest import UserFriendsView
from .friendRequest import SentFriendRequestsView
from .friendRequest import CancelFriendRequestView
from .friendRequest import OnlineFriendsView
from .friendRequest import SuggestedConnectionsView

from .profile import AllUsersView
from .profile import EditProfileView

from .BlockRelationship import BlockUserView
from .BlockRelationship import BlockedUsersView
from .BlockRelationship import UnblockUserView

# from .profile import ProfileModelViewSet
from .profile import ProfileApiView
