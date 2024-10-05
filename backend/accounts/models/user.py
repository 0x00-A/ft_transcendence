from django.db import models
from django.contrib.auth.models import AbstractUser
# from models.userManager import UserManager

class User(AbstractUser):
    email = models.EmailField(unique=True, null=False, blank=False);
