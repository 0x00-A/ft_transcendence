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
from .models.user import User
from .serializer import UserSerializer

class createAccount(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

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
