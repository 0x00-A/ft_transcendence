from django.shortcuts import redirect
from django.conf import settings
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
import requests
from ..serializers import Oauth2UserSerializer
from ..models import User
from ..views.login import get_token_for_user

REDIRECT_URI = "http://localhost:8000/api/oauth2/discord/"


def discord_authorize(request):
    if request.method == 'GET':
        return redirect(settings.DISCORD_AUTHORIZATION_URL)


@api_view(['POST'])
@permission_classes([AllowAny])
def oauth2_set_username(request):
    print('--------------', request.session.get('discord_user', None), '----------------')
    return Response(data={'meassage': "sessio regaloo"})

@api_view()
@permission_classes([AllowAny])
def oauth2_discord(request):
    code = request.GET.get('code')
    if code is None:
        return redirect(discord_authorize)
        return Response(data={"message": "Not authorized!, go to '/oauth2/discord/authorize/' to get authorozation"}, status=status.HTTP_401_UNAUTHORIZED)
    token = exchange_code(code)
    if token is None:
        return Response(data={"error": "Failed to get the token from discord!"}, status=status.HTTP_400_BAD_REQUEST)
    discord_user = get_discord_user(token)
    if discord_user is None:
        return Response(data={"error": "Failed to get user discord resources!"}, status=status.HTTP_400_BAD_REQUEST)
    try:
        check_user = User.objects.get(email=discord_user['email'])
    except User.DoesNotExist:
        check_user = None
    if check_user is None:
        if User.objects.filter(username=discord_user['username']).exists():
            return Response(data={ 'message': "Username already taken, Please choose a new one.!" }, status=status.HTTP_409_CONFLICT)
        serializer = Oauth2UserSerializer(data = {
            # 'provider_id': discord_user['id'],
            'username': discord_user['username'],
            'email' : discord_user['email'],
            'avatar_link' : f"https://cdn.discordapp.com/avatars/{discord_user['id']}/{discord_user['avatar']}.png",
        })
        serializer.is_valid(raise_exception=True)
        serializer.save()
        user = authenticate(email=serializer.validated_data['email'])
        if user is None:
            return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(data=get_token_for_user(user=user), status=status.HTTP_200_OK)
    return Response(data=get_token_for_user(check_user), status=status.HTTP_200_OK)


def exchange_code(code:str):
    data = {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI
    }
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    try:
        res = requests.post(settings.DISCORD_TOKEN_URL, data=data, headers=headers,
                            auth=(settings.DISCORD_CLIENT_ID, settings.DISCORD_CLIENT_SECRET))
        res.raise_for_status()
        return res.json()
    except requests.exceptions.HTTPError as err:
        print('-->', err)
        return None
    except Exception as err:
        print('-->', err)
        return None


def get_discord_user(token):
    access_token = token['access_token']
    try:
        res = requests.get(settings.DISCORD_USER_URL, headers={
            'Authorization': "Bearer %s" % access_token
        })
        res.raise_for_status()
    except requests.exceptions.HTTPError as e:
        print('-->', e)
        return None
    except Exception as e:
        print('-->', e)
        return None
    return res.json()