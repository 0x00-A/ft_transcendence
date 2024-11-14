from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from accounts.authenticate import CookieJWTAuthentication
import requests
from ..serializers import Oauth2UserSerializer
from ..views.login import get_token_for_user
from django.conf import settings


class ConfirmOauth2Login(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        print('api ==> oauth2_confirm_login: User is authenticated')
        return Response({"message": "User is authenticated"}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def oauth2_set_username(request):

    user_data = request.session.get('user_data')
    if user_data is None:
        print('api ==> oauth2_set_username: User data not found in the session')
        return Response(data={'message': 'Bad request'}, status=status.HTTP_400_BAD_REQUEST)
    if 'username' not in request.data:
        print('api ==> oauth2_set_username: Missing username data')
        return Response(data={'message': "Missing 'username' data!"}, status=status.HTTP_400_BAD_REQUEST)
    serializer = Oauth2UserSerializer(data = {
        'username': request.data['username'],
        'email' : user_data['email'],
        'avatar_link' : user_data['avatar_link'],
    })
    serializer.is_valid(raise_exception=True)
    serializer.save()
    del request.session['user_data']
    user = authenticate(email=serializer.validated_data['email'])
    if user is None:
        print('api ==> oauth2_set_username: Failed to authenticate the user')
        return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    token = get_token_for_user(user)
    response = Response(data={'message': 'login success'}, status=status.HTTP_200_OK)
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
    print('api ==> oauth2_set_username: Successfully seting username and authenticating')
    return response


def exchange_code(code:str, choice:str):
    data = {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': settings.OAUTH2_REDIRECT_URI + choice + '/',
    }
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    token_url = {
        'intra': settings.INTRA_TOKEN_URL,
        'discord': settings.DISCORD_TOKEN_URL,
        'google': settings.GOOGLE_TOKEN_URL,
    }.get(choice)
    client_id = {
        'intra': settings.INTRA_CLIENT_ID,
        'discord': settings.DISCORD_CLIENT_ID,
        'google': settings.GOOGLE_CLIENT_ID,
    }.get(choice)
    client_secret = {
        'intra': settings.INTRA_CLIENT_SECRET,
        'discord': settings.DISCORD_CLIENT_SECRET,
        'google': settings.GOOGLE_CLIENT_SECRET,
    }.get(choice)
    try:
        res = requests.post(url=token_url, data=data, headers=headers,
                            auth=(client_id, client_secret))
        res.raise_for_status()
        return res.json()
    except requests.exceptions.HTTPError as err:
        print('-->', err)
        return None
    except Exception as err:
        print('-->', err)
        return None

# def exchange_code(code:str, params):
#     data = {
#         'grant_type': 'authorization_code',
#         'code': code,
#         'redirect_uri': params['redirect_uri']
#     }
#     headers = {
#         'Content-Type': 'application/x-www-form-urlencoded'
#     }
#     try:
#         res = requests.post(url=params['token_url'], data=data, headers=headers,
#                             auth=(params['client_id'], params['client_secret']))
#         res.raise_for_status()
#         return res.json()
#     except requests.exceptions.HTTPError as err:
#         print('-->', err)
#         return None
#     except Exception as err:
#         print('-->', err)
#         return None

def get_oauth2_user(token, choice):
    user_url = {
        'intra': settings.INTRA_USER_URL,
        'discord': settings.DISCORD_USER_URL,
        'google': settings.GOOGLE_USER_URL,
    }.get(choice)
    access_token = token['access_token']
    try:
        res = requests.get(user_url, headers={
            'Authorization': "Bearer %s" % access_token
        })
        res.raise_for_status()
        data = res.json()
        if choice == 'intra':
            user_data = {
                'username': data['login'],
                'email': data['email'],
                'avatar_link': data['image']['link']
            }
        if choice == 'discord':
            user_data = {
                'username': data['username'],
                'email': data['email'],
                'avatar_link': f"https://cdn.discordapp.com/avatars/{data['id']}/{data['avatar']}.png"
            }
        if choice == 'google':
            user_data = {
                'username': data['given_name'].replace(" ", "_"),
                'email': data['email'],
                'avatar_link': data['picture']
            }
        return user_data
    except requests.exceptions.HTTPError as e:
        print('-->', e)
        return None
    except Exception as e:
        print('-->', e)
        return None

# def get_oauth2_user(token, user_url):
#     access_token = token['access_token']
#     try:
#         res = requests.get(user_url, headers={
#             'Authorization': "Bearer %s" % access_token
#         })
#         res.raise_for_status()
#     except requests.exceptions.HTTPError as e:
#         print('-->', e)
#         return None
#     except Exception as e:
#         print('-->', e)
#         return None
#     return res.json()