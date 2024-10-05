from django.contrib import admin
from django.conf import settings
from .models.user import User

# Register your models here.
admin.site.register(User)