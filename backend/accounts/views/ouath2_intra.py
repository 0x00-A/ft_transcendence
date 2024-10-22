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
from django.http import JsonResponse

REDIRECT_URI = "http://localhost:8000/api/oauth2/intra/"

def intra_authorize(request):
    if request.method == 'GET':
        return redirect(settings.INTRA_AUTHORIZATION_URL)


@api_view()
@permission_classes([AllowAny])
def oauth2_intra(request):
    code = request.GET.get('code')
    if code is None:
        return redirect(intra_authorize)
        # return Response(data={"message": "Not authorized!, go to '/oauth2/intra/authorize/' to get authorozation"}, status=status.HTTP_401_UNAUTHORIZED)
    token = exchange_code(code)
    if token is None:
        return Response(data={"error": "Failed to get the token from intra!"}, status=status.HTTP_400_BAD_REQUEST)
    intra_user = get_intra_user(token)
    if intra_user is None:
        return Response(data={"error": "Failed to get user intra resources!"}, status=status.HTTP_400_BAD_REQUEST)
    try:
        check_user = User.objects.get(email=intra_user['email'])
    except User.DoesNotExist:
        check_user = None
    if check_user is None:
        serializer = Oauth2UserSerializer(data = {
            # 'id': intra_user['id'],
            # 'username': intra_user['login'],
            'email' : intra_user['email'],
            'avatar_link' : intra_user['image']['link'],
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
        res = requests.post(settings.INTRA_TOKEN_URL, data=data, headers=headers,
                            auth=(settings.INTRA_CLIENT_ID, settings.INTRA_CLIENT_SECRET))
        res.raise_for_status()
        return res.json()
    except requests.exceptions.HTTPError as err:
        print('-->', err)
        return None
    except Exception as err:
        print('-->', err)
        return None


def get_intra_user(token):
    access_token = token['access_token']
    try:
        res = requests.get(settings.INTRA_USER_URL, headers={
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