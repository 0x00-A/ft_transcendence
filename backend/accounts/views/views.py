
# rest framework
from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken

from django.shortcuts import get_object_or_404


# django
from django.contrib.auth import authenticate
from rest_framework.views import APIView











# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def profile_detail(request, username):
#     # print('---------------', request, '------------------')
#     # print('---------------', args, '------------------')
#     # print('---------------', kwargs, '------------------')
#     # print('----+++++++', kwargs['username'], '------+++++++++')
#     if request.method == 'POST':
#         # if kwargs['username'] is None:
#         #     return Response('Invalid username', status=status.HTTP_404_NOT_FOUND)
#         profile = Profile.objects.select_related('user').get(user__username=username)
#         if profile is not None:
#             serializer = ProfileSerializer(profile)
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         else:
#             return Response('Invalid username', status=status.HTTP_404_NOT_FOUND)

# class ProfileDetail(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request, username):
#         queryset = Profile.objects.select_related('user').get(user__username=username)
#         serializer = ProfileSerializer(queryset)
#         return Response(serializer.data, status=status.HTTP_200_OK)
        # else:
        #     return Response('Invalid username', status=status.HTTP_404_NOT_FOUND)

# class ProfileDetail(RetrieveAPIView):
#     permission_classes = [IsAuthenticated]
#     serializer_class = ProfileSerializer

#     def retrieve(self, request, username=None):
#         queryset = Profile.objects.select_related('user').get(user__username=username)
#         profile = get_object_or_404(queryset)
#         if profile is not None:
#             serializer = ProfileSerializer(profile)
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         else:
#             return Response('Invalid username', status=status.HTTP_404_NOT_FOUND)

# class ProfileView(APIView):
#     pass
# class LoginView(generics.CreateAPIView):
#     queryset = User.objects.all()
#     permission_classes = [AllowAny]
#     serializer_class = UserSerializer

#     def post(self, request, *args, **kwargs):
#         print('-----------------', request.data, '-----------------')
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         self.perform_create(serializer)
#         headers = self.get_success_headers(serializer.data)
#         reply = 'You account has been created you can now login';
#         return Response(reply, status=status.HTTP_201_CREATED, headers=headers)



# class ProfileView(generics.ListCreateAPIView):
#     authentication_classes = [JWTAuthentication]
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         content = {'message': 'hello, world!'}
#         return Response(content)


# @api_view(['GET', 'PUT'])
# def user_detail(request, id):
#     user = get_object_or_404(User, pk=id)
#     if request.method == 'GET':
#         serializer = UserSerializer(user)
#         return Response(serializer.data)
#     elif request.method == 'PUT':
#         serializer = UserSerializer(user, data=request.data)
#         serializer.is_valid(raise_exception=True)
#         serializer.save()
#         return Response(serializer.data)
# class AccountsList(generics.ListCreateAPIView):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer
    # permission_classes = [IsAdminUser]


OAUTH_URL_DISCORD = "https://discord.com/oauth2/authorize?client_id=1295693135552188456&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fapi%2Faccounts%2Foauth2_discord%2Flogin%2F&scope=identify"
CLIENT_ID = "1295693135552188456"
CLIENT_SECRET = "81yb5uN0PjjUpBu-rkldaZntA26K82EA"
REDIRECT_URI = "http://localhost:8000/api/accounts/oauth2_discord/login/"
DISCORD_GET_TOKEN = "https://discord.com/api/v10"


from django.shortcuts import redirect
from django.http import JsonResponse
import requests
from ..models import User

def discord_redirect(request):
    if request.method == 'GET':
        return redirect(OAUTH_URL_DISCORD)


def exchange_code(code):
    data = {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
    }
    headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
    print('--------HEADERS--------', headers)
    print('--------DATA--------', data)

    try:
        r = requests.post('%s/oauth2/token' % DISCORD_GET_TOKEN, data=data, headers=headers, auth=(CLIENT_ID, CLIENT_SECRET))
        r.raise_for_status()
        return r.json()
    except requests.exceptions.HTTPError as e:
        print('--------ERROR--------', e)
    except Exception as e:
        print('--------ERROR--------', e)
    return None
    # r.raise_for_status()
    # return r
    # return r.json()
    # credentials = r.json()
    # access_token = credentials['access_token']
    # response = requests.get("https://discord.com/api/v6/users/@me", headers={
    #     'Authorization': "Bearer %s" % access_token
    # })
    # user = response.json()
    # return user


def oauth2_discord(request):
    code = request.GET.get('code')
    print('-----CODE------', code)
    # return JsonResponse({"code": code})
    # r = exchange_code(code)
    # return JsonResponse({"Response": r})
    r = exchange_code(code)
    print('--------l exchange safi rah salaa------------', r)
    if r is None:
        return JsonResponse({"message": "l9lawii n3amasss hh!"})
    access_token = r['access_token']
    print('--------ACCESS_TOKEN--------', access_token)
    try:
        res = requests.get("https://discord.com/api/v6/users/@me", headers={
            'Authorization': "Bearer %s" % access_token
        })
        res.raise_for_status()
    except requests.exceptions.HTTPError as e:
        print('--------ERROR--------', e)
        return None
    except Exception as e:
        print('--------ERROR--------', e)
        return None
    userdata = res.json()
    user = User.objects.creat
    print('----------USER----------', user)
    us = User.objects.create_user(username=user['username'], email=user['email'])
    # return JsonResponse(user)
    avatarHash = userdata['avatar']
    res = requests.get("https://cdn.discordapp.com/avatars/%s/%s.png" % (userdata['id'], avatarHash))
    if res.status_code == status.HTTP_200_OK:
        with open('avatar.png', 'wb') as f:
            f.write(res.content)
    print('--------res--------', res)
    return JsonResponse(res.json())