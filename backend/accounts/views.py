# MODELS
from .models.user import User
from .models.profile import Profile

# serializers
from .serializers.userSerializer import UserRegisterSerializer, UserLoginSerializer
from .serializers.profileSerialzer import ProfileSerializer

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

# from rest_framework_simplejwt.authentication import JWTAuthentication
# from django.contrib.auth import authenticate
# from rest_framework.views import APIView
# from rest_framework_simplejwt.tokens import RefreshToken
# from django.shortcuts import get_object_or_404
# from .serializer import ProfileSerializer

################
#   api_view   #
################

# @api_view(['POST'])
# @permission_classes([AllowAny])
# def signup_user(request):
#     print('--------', request.data, '--------')
#     if request.method == 'POST':
#         serializer = UserRegisterSerializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         serializer.save()
#         msg = 'Your account has been created, you can login now.'
#         return Response({'message': msg}, status=status.HTTP_201_CREATED)



class SignupView(CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserRegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        reply = 'Your account has been created, you can login now.';
        return Response({'message': reply}, status=status.HTTP_201_CREATED, headers=headers)


def get_token_for_user(user:User):
    refresh = RefreshToken.for_user(user)

    return {
        'username': user.username,
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'message': 'Login successful',
    }

# @api_view(['POST'])
# @permission_classes([AllowAny])
# def login_view(request):
#     if request.method == 'POST':
#         serializer = UserLoginSerializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         user = authenticate(
#             username = serializer.validated_data['username'],
#             password = serializer.validated_data['password'])
#         if user is not None:
#             return Response(data=get_token_for_user(user),
#                                 status=status.HTTP_200_OK)
#         else:
#             return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class LoginView(CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserLoginSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = authenticate(
            username = serializer.validated_data['username'],
            password = serializer.validated_data['password'])
        if user is not None:
            return Response(data=get_token_for_user(user),
                                status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

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

class ProfileDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, username):
        queryset = Profile.objects.select_related('user').get(user__username=username)
        serializer = ProfileSerializer(queryset)
        return Response(serializer.data, status=status.HTTP_200_OK)
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
