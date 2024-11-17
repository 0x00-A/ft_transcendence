from os import path
from django.urls import re_path

from .consumers import OnlineStatusConsumer
from .consumers import NotificationConsumer

websocket_urlpatterns = [
    #     re_path(r'ws/online-status/$',
    #             OnlineStatusConsumer.OnlineStatusConsumer.as_asgi()),
    re_path(r'ws/notifications/$',
            NotificationConsumer.as_asgi()),
]
