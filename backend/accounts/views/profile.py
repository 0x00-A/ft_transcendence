# views.py
from accounts.serializers.userSerializer import UserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
# from ..models import Profile
# from ..serializers import ProfileSerializer

from django.contrib.auth import get_user_model

User = get_user_model()

class AllUsersView(APIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

