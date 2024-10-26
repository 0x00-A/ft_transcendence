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
    token = exchange_code(code, {
        'redirect_uri': REDIRECT_URI,
        'token_url': settings.GOOGLE_TOKEN_URL,
        'client_id': settings.GOOGLE_CLIENT_ID,
        'client_secret': settings.GOOGLE_CLIENT_SECRET
    })
    if token is None:
        return Response(data={"error": "Failed to get the token from google!"}, status=status.HTTP_400_BAD_REQUEST)
    google_user = get_oauth2_user(token, settings.GOOGLE_USER_URL)
    if google_user is None:
        return Response(data={"error": "Failed to get user google resources!"}, status=status.HTTP_400_BAD_REQUEST)
    try :
        check_user = User.objects.get(email=google_user['email'])
    except User.DoesNotExist:
        check_user = None
    if check_user is None:
        google_username = f"{google_user['given_name']}_{google_user['family_name']}"
        if User.objects.filter(username=google_username).exists():
            request.session['user_data'] = {'email': google_user['email'],'avatar_link' : google_user['picture']}
            return Response(data={ 'message': "The provider's username already taken, Please choose a new one!",
                                  'link': "http://localhost:8000/api/oauth2/set_username/" }, status=status.HTTP_409_CONFLICT)
        serializer = Oauth2UserSerializer(data = {
            'username' : google_username,
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
