from os import path
from django.urls import re_path

from accounts.consumers import NotificationConsumer

websocket_urlpatterns = [
    re_path(r'ws/notifications/$',
            NotificationConsumer.as_asgi()),
]
