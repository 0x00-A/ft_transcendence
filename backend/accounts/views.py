from django.shortcuts import render
from .models import User
from .serializer import UserSerializer
from rest_framework import generics
# from rest_framework.permissions import IsAdminUser

class AccountsList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    # permission_classes = [IsAdminUser]
