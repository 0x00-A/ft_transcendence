from django.urls import re_path

from .consumers import GameConsumer
from .consumers import MultiGameConsumer
from .consumers import ChatConsumer

websocket_urlpatterns = [
    # re_path(r"ws/chat/(?P<room_name>\w+)/$", consumers.ChatConsumer.as_asgi()),
    re_path(r'ws/game/(?P<game_id>\w+)/$', GameConsumer.as_asgi()),
    re_path(r'ws/multigame/(?P<game_id>\w+)/$', MultiGameConsumer.as_asgi()),
    # re_path(r'ws/game/(?P<game_id>\w+)/$', GameConsumer.as_asgi()),
]
