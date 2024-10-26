from django.db import models
from .profile import Profile


class FriendRequest(models.Model):
    sender = models.ForeignKey(Profile, related_name='sent_requests', on_delete=models.CASCADE)
    receiver = models.ForeignKey(Profile, related_name='received_requests', on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('rejected', 'Rejected')], default='pending')
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('sender', 'receiver')

    def __str__(self) -> str:
        return f"{self.sender.user.username} -> {self.receiver.user.username} = {self.status}"