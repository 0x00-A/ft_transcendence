from django.shortcuts import redirect
from django.conf import settings
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from ..serializers import Oauth2UserSerializer
from ..models import User
from ..views.login import get_token_for_user
from ..views.oauth2_utils import exchange_code, get_oauth2_user
from urllib.parse import quote

REDIRECT_URI = "http://localhost:8000/api/oauth2/intra/"

def oauth2_authorize(request, choice):
    print('2----------->>>>>>', choice, '<<<<<<------------')
    if request.method == 'GET':
        if choice == 'intra':
            return redirect(settings.INTRA_AUTHORIZATION_URL)
        if choice == 'discord':
            return redirect(settings.DISCORD_AUTHORIZATION_URL)
        if choice == 'google':
            return redirect(settings.GOOGLE_AUTHORIZATION_URL)


@api_view()
@permission_classes([AllowAny])
def oauth2_authentication(request, choice):
    print('1----------->>>>>>', choice, '<<<<<<------------')
    code = request.GET.get('code')
    if code is None:
        return redirect(oauth2_authorize, choice)

    token = exchange_code(code, {'redirect_uri': REDIRECT_URI,
                                    'token_url': settings.INTRA_TOKEN_URL,
                                    'client_id': settings.INTRA_CLIENT_ID,
                                    'client_secret': settings.INTRA_CLIENT_SECRET})
    if token is None:
        return redirect(f"{settings.API_CLIENT_OAUTH2_REDIRECT_URI}?status=failed&error={quote('Failed to get the token from intra!')}")
    intra_user = get_oauth2_user(token, settings.INTRA_USER_URL)
    if intra_user is None:
        return redirect(f"{settings.API_CLIENT_OAUTH2_REDIRECT_URI}?status=failed&error={quote('Failed to get user intra resources!')}")
    try:
        check_user = User.objects.get(email=intra_user['email'])
    except User.DoesNotExist:
        check_user = None
    if check_user is None:
        if User.objects.filter(username=intra_user['login']).exists():
            request.session['user_data'] = {'email': intra_user['email'], 'avatar_link' : intra_user['image']['link']}
            return redirect(f"{settings.API_CLIENT_OAUTH2_REDIRECT_URI}?status=set_username&message={quote('your intra username already taken, Please choose a new one!')}")
        serializer = Oauth2UserSerializer(data = {
            'username': intra_user['login'],
            'email' : intra_user['email'],
            'avatar_link' : intra_user['image']['link'],
        })
        if not serializer.is_valid():
            return redirect(f"{settings.API_CLIENT_OAUTH2_REDIRECT_URI}?status=failed&error={quote('A data in your intra user not compatible with our criteria!')}")
        serializer.save()
        check_user = authenticate(email=serializer.validated_data['email'])
        if check_user is None:
            return redirect(f"{settings.API_CLIENT_OAUTH2_REDIRECT_URI}?status=failed&error={quote('Authenticate the user failed')}")
    token = get_token_for_user(check_user)
    if token is None:
        return redirect(f"{settings.API_CLIENT_OAUTH2_REDIRECT_URI}?status=failed&error={quote('Getting tokens for user failed')}")
    response = redirect(f"{settings.API_CLIENT_OAUTH2_REDIRECT_URI}?status=success")
    response.set_cookie(
        key = 'access_token',
        value = token['access'],
        httponly = True,
        secure = True,
        samesite = 'Strict'
    )
    response.set_cookie(
        key = 'refresh_token',
        value = token['refresh'],
        httponly = True,
        secure = True,
        samesite = 'Strict'
    )
    return response