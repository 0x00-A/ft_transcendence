from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

class User(AbstractUser):
    email = models.EmailField(unique=True, null=False, blank=False)
    is_oauth_user = models.BooleanField(default=False)
    is_password_set = models.BooleanField(default=True)
    friends = models.ManyToManyField('self', blank=True, symmetrical=True)
    is2fa_active = models.BooleanField(default=False)
    otp_secret = models.CharField(max_length=32, blank=True, null=True)
    otp_expires = models.DateTimeField(blank=True, null=True)
    last_seen = models.CharField(max_length=50, default="Never", blank=True)
    active_conversation = models.IntegerField(default=-1)
    has_new_requests = models.BooleanField(default=False)


    def __str__(self):
        return self.username


class EmailVerification(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    token = models.UUIDField(default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    new_email = models.EmailField(unique=True, null=True, blank=True)

    def __str__(self):
        return self.user.username

class PasswordReset(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    token = models.UUIDField(default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username