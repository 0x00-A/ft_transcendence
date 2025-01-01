from django.utils.deprecation import MiddlewareMixin


class RefreshTokenMiddleware(MiddlewareMixin):
    def process_request(self, request):
        # print('+++++++++++request.headers++++++++++++', request.headers, '+++++++++++request.headers++++++++++++')
        # print('-----------request.user-----------', request.user, '-----------request.user-----------')
        pass

    def process_response(self, request, response):
        # print('+++++++++++request.headers++++++++++++', request.headers, '+++++++++++request.headers++++++++++++')
        if 'new_access_token' in request.session:
            new_access_token = request.session.get('new_access_token')
            del request.session['new_access_token']
            request.session.save()
            response.set_cookie(
                'access_token',
                new_access_token,
                httponly=True,
                secure=False,
                samesite='Strict'
            )
        return response
