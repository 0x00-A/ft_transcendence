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
from ..views.oauth2_utils import exchange_code, get_oauth2_user
from urllib.parse import quote

REDIRECT_URI = "http://localhost:8000/api/oauth2/discord/"

CALLBACK_URI = ''

def discord_authorize(request):
    if request.method == 'GET':
        return redirect(settings.DISCORD_AUTHORIZATION_URL)


@api_view()
@permission_classes([AllowAny])
def oauth2_discord(request):
    if request.session.get('callback_uri') is None:
        request.session['callback_uri'] = request.GET.get('redirect_uri')
        if request.session['callback_uri'] is None:
            return Response(data={'message': 'Bad request'}, status=status.HTTP_400_BAD_REQUEST)
    code = request.GET.get('code')
    if code is None:
        return redirect(discord_authorize)
    token = exchange_code(code, {'redirect_uri': REDIRECT_URI,
                                              'token_url': settings.DISCORD_TOKEN_URL,
                                              'client_id': settings.DISCORD_CLIENT_ID,
                                              'client_secret': settings.DISCORD_CLIENT_SECRET})
    if token is None:
        return redirect(f"{request.session['callback_uri']}?status=400&error={quote('Failed to get the token from discord!')}")
        # return Response(data={"error": "Failed to get the token from discord!"}, status=status.HTTP_400_BAD_REQUEST)
    discord_user = get_oauth2_user(token, settings.DISCORD_USER_URL)
    if discord_user is None:
        return redirect(f"{request.session['callback_uri']}?status=400&error={quote('Failed to get user discord resources!')}")
        # return Response(data={"error": "Failed to get user discord resources!"}, status=status.HTTP_400_BAD_REQUEST)
    try:
        check_user = User.objects.get(email=discord_user['email'])
    except User.DoesNotExist:
        check_user = None
    if check_user is None:
        if User.objects.filter(username=discord_user['username']).exists():
            request.session['user_data'] = {
                'email': discord_user['email'],
                'avatar_link' : f"https://cdn.discordapp.com/avatars/{discord_user['id']}/{discord_user['avatar']}.png"
                }
            # request.session.save()
            return redirect(f"{request.session['callback_uri']}?status=409&error={quote('your discord username already taken, Please choose a new one!')}&link=http://localhost:8000/api/oauth2/set_username/")
            # return Response(data={ 'message': "The provider's username already taken, Please choose a new one!",
            #                       'link': "http://localhost:8000/api/oauth2/set_username/" }, status=status.HTTP_409_CONFLICT)
        serializer = Oauth2UserSerializer(data = {
            'username': discord_user['username'],
            'email' : discord_user['email'],
            'avatar_link' : f"https://cdn.discordapp.com/avatars/{discord_user['id']}/{discord_user['avatar']}.png",
        })
        serializer.is_valid(raise_exception=True)
        serializer.save()
        user = authenticate(email=serializer.validated_data['email'])
        if user is None:
            return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        data = get_token_for_user(user)
        return redirect(f"{request.session['callback_uri']}?status=200&access={data['access']}&refresh={data['refresh']}")
        # return Response(data=get_token_for_user(user=user), status=status.HTTP_200_OK)
    data = get_token_for_user(check_user)
    return redirect(f"{request.session['callback_uri']}?status=200&access={data['access']}&refresh={data['refresh']}")
    # return Response(data=get_token_for_user(check_user), status=status.HTTP_200_OK)
