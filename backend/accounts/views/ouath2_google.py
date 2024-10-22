from django.shortcuts import redirect
from django.conf import settings
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
import requests
from ..serializers import Oauth2UserSerializer
from ..models import User
from ..views.login import get_token_for_user


REDIRECT_URI = "http://localhost:8000/api/oauth2/google/"


def google_authorize(request):
    if request.method == 'GET':
        auth_url = f"{settings.GOOGLE_AUTHORIZATION_URL}?client_id={settings.GOOGLE_CLIENT_ID}&redirect_uri={REDIRECT_URI}&response_type=code&scope=email+profile"
        return redirect(auth_url)


@api_view()
@permission_classes([AllowAny])
def oauth2_google(request):
    code = request.GET.get('code')
    if code is None:
        return redirect(google_authorize)
    token = exchange_code(code)
    if token is None:
        return Response(data={"error": "Failed to get the token from google!"}, status=status.HTTP_400_BAD_REQUEST)
    google_user = get_google_user(token)
    if google_user is None:
        return Response(data={"error": "Failed to get user google resources!"}, status=status.HTTP_400_BAD_REQUEST)
    try :
        check_user = User.objects.get(email=google_user['email'])
    except User.DoesNotExist:
        check_user = None
    if check_user is None:
        serializer = Oauth2UserSerializer(data = {
            # 'provider_id': google_user['id'],
            # 'provider_name': 'google',
            'email' : google_user['email'],
            'avatar_link' : google_user['picture'],
        })
        serializer.is_valid(raise_exception=True)
        serializer.save()
        user = authenticate(email = serializer.validated_data['email'])
        if user is None:
            return Response({'message': 'Invalid credentials, error creation oauth2 user!'}, status=status.HTTP_401_UNAUTHORIZED)
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
        res = requests.post(settings.GOOGLE_TOKEN_URL, data=data, headers=headers,
                            auth=(settings.GOOGLE_CLIENT_ID, settings.GOOGLE_CLIENT_SECRET))
        res.raise_for_status()
        return res.json()
    except requests.exceptions.HTTPError as err:
        print('-->', err)
        return None
    except Exception as err:
        print('-->', err)
        return None


def get_google_user(token):
    access_token = token['access_token']
    try:
        res = requests.get(settings.GOOGLE_USER_URL, headers={
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