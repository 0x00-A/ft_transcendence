from channels.middleware import BaseMiddleware
from urllib.parse import parse_qs
from accounts.models.profile import Profile
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.contrib.auth.models import AnonymousUser
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from asgiref.sync import sync_to_async
from http.cookies import SimpleCookie
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError


User = get_user_model()


# @database_sync_to_async
# def get_user_from_token(token):
#     try:
#         # Decode the token and get the user ID
#         validated_token = UntypedToken(token)
#         user_id = validated_token['user_id']
#         return User.objects.get(id=user_id)
#     except (InvalidToken, TokenError, User.DoesNotExist):
#         return AnonymousUser()


class JwtAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        print('----scope----', scope)
        headers = dict(scope['headers'])

        cookie = headers.get(b'cookie', b'').decode('utf-8')
        cookies = SimpleCookie(cookie)
        access_token = cookies.get('access_token').value
        # refresh_token = cookies.get('refresh_token').value
        if access_token:
            try:
                validated_token = JWTAuthentication().get_validated_token(raw_token=access_token)
                user = await sync_to_async(JWTAuthentication().get_user)(validated_token)
                scope['user'] = user
                print('################# USER #####################', scope['user'].username)
            except (InvalidToken, TokenError):
                scope['user'] = AnonymousUser()
        else:
            print('----access_token not in the cookie scope-----')
            scope['user'] = AnonymousUser()
        print('----user----', scope['user'])
        return await super().__call__(scope, receive, send)
