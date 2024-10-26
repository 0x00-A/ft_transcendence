from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView
from rest_framework.views import APIView
from rest_framework.viewsets import ViewSet
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from ..models import Profile
from ..serializers import ProfileSerializer


# class ProfileModelViewSet(ViewSet):
#     queryset = Profile.objects.all()
#     serializer_class = ProfileSerializer

# @api_view()
# @permission_classes([IsAuthenticated])
# def profiles_list(request):
#     if request.method == 'GET':
#         query_set = Profile.objects.all()
#         serializer = ProfileSerializer