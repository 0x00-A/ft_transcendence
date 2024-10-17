from django.shortcuts import redirect
from django.conf import settings
from django.http import JsonResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
import requests


REDIRECT_URI = "http://localhost:8000/api/oauth2/discord/"

def discord_authorize(request):
    if request.method == 'GET':
        return redirect(settings.DISCORD_AUTHORIZATION_URL)


@api_view()
@permission_classes([AllowAny])
def oauth2_discord(request):
    code = request.GET.get('code')
    if code is None:
        return Response(data={"message": "Not authorized!, go to '/oauth2/discord/authorize/' to get authorozation"}, status=status.HTTP_401_UNAUTHORIZED)
    token = exchange_code(code)
    if token[0] is None:
        return Response(data={"Error": token[1]})
    print('---------------', token, '-----------------')
    # discordUser = get_discord_user(token)
    return Response(data={"token": token})


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
        res = requests.post('jashj %s' % settings.DISCORD_TOKEN_URL, data=data, headers=headers,
                            auth=(settings.CLIENT_ID, settings.CLIENT_SECRET))
        res.raise_for_status()
        return res.json()
    except requests.exceptions.HTTPError as err:
        print('-->', err)
        return (None, err)
    except Exception as err:
        print('-->', err)
        return (None, err)
