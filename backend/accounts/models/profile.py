from django.db import models
from .user import User


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar = models.ImageField(
        upload_to='avatars/', default='avatars/avatar.jpeg')
    age = models.PositiveSmallIntegerField(null=True, blank=True)
    level = models.PositiveSmallIntegerField(null=True, blank=True)
    stats = models.JSONField(default=dict, blank=True)
    is_online = models.BooleanField(default=False)

    def __str__(self) -> str:
        return self.user.username
