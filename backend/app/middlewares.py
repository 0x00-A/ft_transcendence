from channels.middleware import BaseMiddleware
from urllib.parse import parse_qs
from accounts.models.profile import Profile
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.contrib.auth.models import AnonymousUser
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from asgiref.sync import sync_to_async


User = get_user_model()


@database_sync_to_async
def get_user_from_token(token):
    try:
        # Decode the token and get the user ID
        validated_token = UntypedToken(token)
        user_id = validated_token['user_id']
        return User.objects.get(id=user_id)
    except (InvalidToken, TokenError, User.DoesNotExist):
        return AnonymousUser()


class JwtAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        query_string = parse_qs(scope['query_string'].decode())
        token = query_string.get('token')

        if token:
            # Strip the token and authenticate the user
            user = await get_user_from_token(token[0])
            scope['user'] = user
            scope['profile'] = await sync_to_async(Profile.objects.get)(user=user)
            # profile = Profile.objects.get(user=user)
            # scope['user'] = user
        else:
            scope['user'] = AnonymousUser()

        return await super().__call__(scope, receive, send)
