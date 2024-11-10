from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class BlockRelationship(models.Model):
    blocker = models.ForeignKey(User, related_name='blocked_users', on_delete=models.CASCADE)
    blocked = models.ForeignKey(User, related_name='blockers', on_delete=models.CASCADE)
    date_blocked = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('blocker', 'blocked')

    def __str__(self):
        return f"{self.blocker.username} blocks {self.blocked.username} on {self.date_blocked}"
