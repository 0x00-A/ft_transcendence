from django.shortcuts import redirect
from django.conf import settings
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from ..serializers import Oauth2UserSerializer
from ..models import User
from ..views.login import get_token_for_user
from ..views.oauth2_utils import exchange_code,get_oauth2_user
from urllib.parse import quote


REDIRECT_URI = "http://localhost:8000/api/oauth2/google/"


def google_authorize(request):
    if request.method == 'GET':
        auth_url = f"{settings.GOOGLE_AUTHORIZATION_URL}?client_id={settings.GOOGLE_CLIENT_ID}&redirect_uri={REDIRECT_URI}&response_type=code&scope=email+profile"
        return redirect(auth_url)


@api_view()
@permission_classes([AllowAny])
def oauth2_google(request):
    if request.session.get('callback_uri') is None:
        request.session['callback_uri'] = request.GET.get('redirect_uri')
        if request.session.get['callback_uri'] is None:
            return Response(data={'message': 'Bad request, a callback uri is missing'}, status=status.HTTP_400_BAD_REQUEST)
    code = request.GET.get('code')
    if code is None:
        return redirect(google_authorize)
    token = exchange_code(code, {
        'redirect_uri': REDIRECT_URI,
        'token_url': settings.GOOGLE_TOKEN_URL,
        'client_id': settings.GOOGLE_CLIENT_ID,
        'client_secret': settings.GOOGLE_CLIENT_SECRET
    })
    if token is None:
        return redirect(f"{request.session['callback_uri']}?status=400&error={quote('Failed to get the token from google!')}")
        # return Response(data={"error": "Failed to get the token from google!"}, status=status.HTTP_400_BAD_REQUEST)
    google_user = get_oauth2_user(token, settings.GOOGLE_USER_URL)
    if google_user is None:
        return redirect(f"{request.session['callback_uri']}?status=400&error={quote('Failed to get user google resources!')}")
        # return Response(data={"error": "Failed to get user google resources!"}, status=status.HTTP_400_BAD_REQUEST)
    try :
        check_user = User.objects.get(email=google_user['email'])
    except User.DoesNotExist:
        check_user = None
    if check_user is None:
        google_username = f"{google_user['given_name']}".replace(" ", "_")
        if User.objects.filter(username=google_username).exists():
            request.session['user_data'] = {'email': google_user['email'],'avatar_link' : google_user['picture']}
            return redirect(f"{request.session['callback_uri']}?status=set_username&message={quote('your google username already taken, Please choose a new one!')}")            # return Response(data={ 'message': "The provider's username already taken, Please choose a new one!",
        serializer = Oauth2UserSerializer(data = {
            'username' : google_username,
            'email' : google_user['email'],
            'avatar_link' : google_user['picture'],
        })
        if not serializer.is_valid():
            return redirect(f"{request.session['callback_uri']}?status=failed&error={quote('A data in your google user not compatible with our criteria!')}")
        serializer.save()
        check_user = authenticate(email = serializer.validated_data['email'])
        if check_user is None:
            return redirect(f"{request.session['callback_uri']}?status=failed&error={quote('Authenticate the user failed')}")
    token = get_token_for_user(check_user)
    if token is None:
        return redirect(f"{request.session['callback_uri']}?status=failed&error={quote('Getting tokens for user failed')}")
    response = redirect(f"{request.session['callback_uri']}?status=success")
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