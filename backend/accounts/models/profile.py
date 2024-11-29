from django.db import models
from .user import User
from .badge import Badge


class Profile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='profile')
    avatar = models.ImageField(
        upload_to='avatars/', default='avatars/avatar.jpeg')
    age = models.PositiveSmallIntegerField(null=True, blank=True)
    score = models.PositiveIntegerField(default=0)
    level = models.PositiveSmallIntegerField(default=0)
    rank = models.PositiveSmallIntegerField(null=True, blank=True)
    badge = models.ForeignKey(
        to=Badge, on_delete=models.SET_NULL, null=True, blank=True)
    stats = models.JSONField(default=dict, blank=True)
    is_online = models.BooleanField(default=False)
    blocked_user_name = models.CharField(max_length=150, default="none", blank=True)

    def update_score(self, win: False, result):
        self.score += result
        if win:
            self.score += 10 + self.badge.xp_reward
        # self.level = self.calculate_level()
        # self.update_badge()
        # self.update_ranks()
        self.save()

    # def calculate_level(self):
    #     return self.score // 100

    # def update_badge(self):
    #     badge = Badge.get_badge(self.level)
    #     if badge and (not self.badge or self.badge['name'] != badge.name):
    #         self.badge = badge
    #         self.save()

    # def update_ranks(self):
    #     rank = self.__class__.objects.filter(score__gt=self.score).count() + 1
    #     if self.rank != rank:
    #         self.rank = rank
    #         self.save()

    def __str__(self) -> str:
        return self.user.username
