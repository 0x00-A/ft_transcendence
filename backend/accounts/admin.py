from django.contrib import admin
from django.conf import settings
from .models import User
from .models import Profile
from .models import FriendRequest
from .models.game import Game

# Register your models here.
admin.site.register(User)
admin.site.register(Profile)
admin.site.register(FriendRequest)
admin.site.register(Game)