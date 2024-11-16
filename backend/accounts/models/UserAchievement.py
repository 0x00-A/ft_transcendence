from django.db import models

from accounts.models import User


class Achievement(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    # category = models.CharField(max_length=50)  # e.g., 'Milestone', 'Skill'
    # Rules for unlocking, e.g., {"games_won": 10}
    condition = models.JSONField()
    reward_points = models.IntegerField(default=0)
    # icon = models.ImageField(
    #     upload_to='achievement_icons/', blank=True, null=True)
    image = models.URLField()
    threshold = models.FloatField()
    progress_percentage = models.FloatField(
        default=0.0)  # Progress in percentage

    def is_unlocked(self):
        return self.progress_percentage >= 100


class UserAchievement(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="achievements")
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE)
    unlocked_at = models.DateTimeField(auto_now_add=True)
    progress = models.JSONField(default=dict)  # e.g., {"games_won": 7}
    is_unlocked = models.BooleanField(default=False)
