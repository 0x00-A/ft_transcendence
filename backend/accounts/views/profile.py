# views.py
from accounts.serializers.userSerializer import UserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status

from django.contrib.auth import get_user_model

User = get_user_model()
from ..models import Profile
from ..serializers import ProfileSerializer


# class AllUsersView(APIView):
#     serializer_class = UserSerializer
#     permission_classes = [AllowAny]
#     def get(self, request):
#         users = User.objects.all()
#         serializer = UserSerializer(users, many=True)
#         return Response(serializer.data)



class AllUsersView(APIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            users = User.objects.exclude(id=request.user.id)
            # users = User.objects.all()
            serializer = UserSerializer(users, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response(
                {'error': 'User profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': 'Internal server error'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )