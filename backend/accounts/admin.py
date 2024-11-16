from .models import Achievement, UserAchievement
from .models import Notification
from django.contrib import admin
from django.conf import settings
from .models import User
from .models import Profile
from .models import FriendRequest

# Register your models here.
admin.site.register(User)
admin.site.register(Profile)
admin.site.register(FriendRequest)
admin.site.register(UserAchievement)
admin.site.register(Notification)
# admin.site.register(Game)


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'condition', 'reward_points')
