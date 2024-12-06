from django.db import models
from django.db.models import F


from .user import User
from .badge import Badge

WIN_SCORE = 10

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
    played_games = models.PositiveIntegerField(default=0)
    wins = models.PositiveIntegerField(default=0)
    losses = models.PositiveIntegerField(default=0)
    is_online = models.BooleanField(default=False)
    blocked_user_name = models.CharField(max_length=150, default="none", blank=True)

    def update_score(self, win:False, result, p2_badge):
        if win:
            self.score += WIN_SCORE + result
            if self.badge.xp_reward < p2_badge:
                self.score += self.badge.xp_reward * 2
            else:
                self.score += self.badge.xp_reward
        else:
            self.score += result
            if self.badge.xp_reward < p2_badge:
                self.score -= p2_badge * 2
        self.save()
        self.calculate_level()
        self.update_badge()
        self.update_ranks()

    def calculate_level(self):
        self.level = self.score // 100
        self.save()

    def update_badge(self):
        badge = Badge.get_badge(self.level)
        if badge and (not self.badge or self.badge.name != badge.name):
            self.badge = badge
            self.save()

    def update_ranks(self):
        profiles = Profile.objects.all().order_by(
            '-score',
            '-wins',
            '-played_games'
            # F('stats__wins').desc(nulls_last=True),
            # F('stats__games_played').desc(nulls_last=True)
        )
        rank = 1
        previous_score = None
        for profile in profiles:
            if profile.score == previous_score:
                rank = rank
            profile.rank = rank
            print('----->>', profile.user.username, profile.score, profile.rank)
            previous_score = profile.score
            rank += 1
        Profile.objects.bulk_update(profiles, ['rank'])

    def __str__(self) -> str:
        return self.user.username
