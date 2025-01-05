from rest_framework_simplejwt.exceptions import InvalidToken, TokenError, AuthenticationFailed
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

from channels.middleware import BaseMiddleware
from django.contrib.auth.models import AnonymousUser
from asgiref.sync import sync_to_async
from http.cookies import SimpleCookie


class JwtAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        async def log_receive():
            print('++++++++++LOGRECEIVE+++++++++++++++')
            event = await receive()
            return event

        async def log_send():
            print('++++++++++LOGRECEIVE+++++++++++++++')
            event = await send()
            return event

        headers = dict(scope['headers'])
        cookie = headers.get(b'cookie', b'').decode('utf-8')
        cookies = SimpleCookie()
        cookies.load(cookie)
        access_token = cookies.get('access_token')
        access_token = access_token.value if access_token else None
        if access_token:
            try:
                validated_token = JWTAuthentication().get_validated_token(raw_token=access_token)
                user = await sync_to_async(JWTAuthentication().get_user)(validated_token)
                scope['user'] = user
            except (InvalidToken, TokenError, AuthenticationFailed):
                scope['user'] = AnonymousUser()
        else:
            scope['user'] = AnonymousUser()
        return await super().__call__(scope, receive, send)


# @database_sync_to_async
# def get_user_from_token(token):
#     try:
#         # Decode the token and get the user ID
#         validated_token = UntypedToken(token)
#         user_id = validated_token['user_id']
#         return User.objects.get(id=user_id)
#     except (InvalidToken, TokenError, User.DoesNotExist):
#         return AnonymousUser()

# class LogOriginMiddleware(MiddlewareMixin):
#     def process_request(self, request):
#         print('++++++++++LOGORIGINMIDDLEWARE+++++++++++++++', request.META['HTTP_ORIGIN'], '+++++++++++++++++++++++++')
