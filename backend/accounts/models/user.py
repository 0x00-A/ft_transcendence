from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    email = models.EmailField(unique=True, null=False, blank=False)
    is_oauth_user = models.BooleanField(default=False)


# class Oauth2User(models.Model):
#     provider_id = models.CharField()
#     provider_name = models.CharField()
#     user = models.OneToOneField(User, on_delete=models.CASCADE)

#     def __str__(self) -> str:
#         return self.user.username