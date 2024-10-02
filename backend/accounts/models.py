from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    email = models.EmailField(max_length=254, unique=True);

    

def get_user_model():
    return User()

# class Player():
#     user = models.OneToOneField()