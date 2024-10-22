from django.contrib import admin
from django.conf import settings
from .models import User
from .models import Profile

# Register your models here.
admin.site.register(User)
admin.site.register(Profile)
