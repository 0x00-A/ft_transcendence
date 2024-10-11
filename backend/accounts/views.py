# from django.shortcuts import get_object_or_404
# from .models import User
# from .serializer import UserSerializer
# from rest_framework import generics
# from rest_framework.permissions import IsAdminUser

################
#   api_view   #
################

# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from rest_framework import status

# @api_view(['GET', 'POST'])
# def list_users(request):
#     # queryset = User.objects.all()
#     if request.method == 'GET':
#         queryset = User.objects.all()
#         serializer = UserSerializer(queryset, many=True, context={'request':request})
#         return Response(serializer.data)
#     elif request.method == 'POST':
#         serializer = UserSerializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         serializer.save()
#         Response(serializer.data, status=status.HTTP_201_CREATED)
        

#####################
#   generic views   #
#####################

from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response
from .models.user import User
from .models import Profile
from .serializer import UserSerializer, UserLoginSerializer, UserRegisterSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from .serializer import ProfileSerializer


class ProfileDetail(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request, id):
        profile = get_object_or_404(Profile, pk=id)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request, id):
        profile = Profile.objects.get(user=request.user)
        serializer = ProfileSerializer(profile, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class SignupView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserRegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        reply = 'You account has been created you can now login';
        return Response(reply, status=status.HTTP_201_CREATED, headers=headers)


class LoginView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserLoginSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            token = RefreshToken.for_user(user)
            return Response({'message': 'Login successful',
                             'refresh': str(token),
                             'access': str(token.access_token)}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class ProfileView(APIView):
    pass
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



class ProfileView(generics.ListCreateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        content = {'message': 'hello, world!'}
        return Response(content)
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
#     # permission_classes = [IsAdminUser]
