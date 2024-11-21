"""
ASGI config for app project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os
from game.routing import websocket_urlpatterns
from matchmaker.routing import websocket_urlpatterns as matchmaker_urlpatterns

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from .middlewares import JwtAuthMiddleware

import matchmaker.routing
import game.routing
import accounts.routing
import chat.routing


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app.settings')
# Initialize Django ASGI application early to ensure the AppRegistry
# is populated before importing code that may import ORM models.
django_asgi_app = get_asgi_application()


application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AllowedHostsOriginValidator(
        JwtAuthMiddleware(URLRouter(matchmaker.routing.websocket_urlpatterns +
                                    game.routing.websocket_urlpatterns +
                                    accounts.routing.websocket_urlpatterns +
                                    chat.routing.websocket_urlpatterns
                                    ))
    )
})

# application = get_asgi_application()
