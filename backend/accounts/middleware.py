from django.utils.deprecation import MiddlewareMixin
from django.conf import settings

class RefreshTokenMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        # Check if new_access_token is set by the authentication process
        if 'new_access_token' in request.session:
            new_access_token = request.session.get('new_access_token')
            del request.session['new_access_token']
            request.session.save()
            print("----New access token found in request:----")
            # Set the new access token as an HttpOnly cookie
            response.set_cookie(
                'access_token',
                new_access_token,
                httponly=True,
                secure=False,  # Set to False in development if needed
                samesite='Strict'
            )
        return response