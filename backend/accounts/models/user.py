from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    email = models.EmailField(unique=True, null=False, blank=False)
    is_oauth_user = models.BooleanField(default=False)
    friends = models.ManyToManyField('self', blank=True, symmetrical=True)
    is2fa_active = models.BooleanField(default=False)
    otp_secret = models.CharField(max_length=32, blank=True, null=True)
    otp_expires = models.DateTimeField(blank=True, null=True)
    last_seen = models.CharField(max_length=50, default="Never", blank=True)
    active_conversation = models.IntegerField(default=-1)  


    def __str__(self):
        return self.username
