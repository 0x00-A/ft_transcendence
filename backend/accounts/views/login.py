from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from ..models import User
from ..serializers import UserLoginSerializer


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