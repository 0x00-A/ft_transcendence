from django.shortcuts import redirect
from django.urls import reverse
from django.conf import settings
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from ..serializers import Oauth2UserSerializer
from ..models import User
from ..views.login import get_token_for_user
from ..views.oauth2_utils import exchange_code, get_oauth2_user
from urllib.parse import quote

REDIRECT_URI = "http://localhost:8000/api/oauth2/intra/"

def oauth2_authorize(request, choice):
    if request.method == 'GET':
        if choice == 'intra':
            print('api ==> oauth2_authorize: redirecting to intra authorization')
            return redirect(settings.INTRA_AUTHORIZATION_URL)
        if choice == 'discord':
            print('api ==> oauth2_authorize: redirecting to discord authorization')
            return redirect(settings.DISCORD_AUTHORIZATION_URL)
        if choice == 'google':
            auth_url = f"{settings.GOOGLE_AUTHORIZATION_URL}?client_id={settings.GOOGLE_CLIENT_ID}&redirect_uri={settings.OAUTH2_REDIRECT_URI}google/&response_type=code&scope=email+profile"
            print('api ==> oauth2_authorize: redirecting to google authorization')
            return redirect(auth_url)


@api_view()
@authentication_classes([])
@permission_classes([AllowAny])
def oauth2_authentication(request, choice):
    code = request.GET.get('code')
    if code is None:
        return redirect(reverse('oauth2_authorize', kwargs={'choice': choice}))
    token = exchange_code(code, choice)
    if token is None:
        print('api ==> oauth2_authentication: Failed to get the token')
        return redirect(f"{settings.API_CLIENT_OAUTH2_REDIRECT_URI}?status=failed&error={quote(f'Failed to get the token from {choice}')}")
    user_data = get_oauth2_user(token, choice)
    if user_data is None:
        print('api ==> oauth2_authentication: Failed to get user data')
        return redirect(f"{settings.API_CLIENT_OAUTH2_REDIRECT_URI}?status=failed&error={quote(f'Failed to get user {choice} resources!')}")
    try:
        check_user = User.objects.get(email=user_data['email'])
    except User.DoesNotExist:
        check_user = None
    if check_user is None:
        if User.objects.filter(username=user_data['username']).exists():
            request.session['user_data'] = {'email': user_data['email'], 'avatar_link' : user_data['avatar_link']}
            print('api ==> oauth2_authentication: Username already exist')
            return redirect(f"{settings.API_CLIENT_OAUTH2_REDIRECT_URI}?status=set_username&message={quote(f'Your {choice} username is already exist, Please choose a new one!')}")
        serializer = Oauth2UserSerializer(data = user_data)
        if not serializer.is_valid():
            print('api ==> oauth2_authentication: User data not compatible with our criteria')
            return redirect(f"{settings.API_CLIENT_OAUTH2_REDIRECT_URI}?status=failed&error={quote(f'A data in your {choice} user not compatible with our criteria!')}")
        serializer.save()
        check_user = authenticate(email=serializer.validated_data['email'])
        if check_user is None:
            print('api ==> oauth2_authentication: Failed to authenticate the user')
            return redirect(f"{settings.API_CLIENT_OAUTH2_REDIRECT_URI}?status=failed&error={quote('Authenticate the user failed')}")
    token = get_token_for_user(check_user)
    if token is None:
        print('api ==> oauth2_authentication: Failed to get tokens for user')
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
    print('api ==> oauth2_authentication: Successfully authenticated')
    return response