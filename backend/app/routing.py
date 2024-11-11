from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import path, include

# Import the routing configurations from both apps
import matchmaker.routing
import game.routing
import accounts.routing

application = ProtocolTypeRouter({
    # Add WebSocket URL routing via AuthMiddlewareStack
    'websocket': AuthMiddlewareStack(
        URLRouter(
            # Include both matchmaking and game WebSocket URL patterns
            matchmaker.routing.websocket_urlpatterns +
            game.routing.websocket_urlpatterns +
            accounts.routing.websocket_urlpatterns
        )
    ),
})
