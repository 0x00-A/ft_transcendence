from django.utils.deprecation import MiddlewareMixin
from django.conf import settings

class RefreshTokenMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        # Check if new_access_token is set by the authentication process
        if hasattr(request, 'new_access_token'):
            print('has new access token')
            # Set the new access token as an HttpOnly cookie
            response.set_cookie(
                'access_token',
                request.new_access_token,
                httponly=True,
                secure=True,  # Set to False in development if needed
                samesite='Lax'
            )
        return response