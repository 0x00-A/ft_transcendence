from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status

from accounts.models import User
from accounts.serializers import UserProfileSerializer
from accounts.serializers import UserSerializer


class MyProfileView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer

    def get(self, request):
        try:
            user = request.user
            serializer = UserProfileSerializer(user, context={'request': request})
            print('api ==> get profile: User profile found')
            return Response(serializer.data, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            print('api ==> get profile: User profile not found')
            return Response(
                {'error': 'User profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Internal server error: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
            serializer = UserSerializer(user, context={'request': request})
            if serializer.data['friend_status'] == 'Blocker':
                return Response(
                    {'message': 'You blocked this user, you cannot see his profile', 'status': 'Blocker'},
                    status=status.HTTP_200_OK
                )
            if serializer.data['friend_status'] == 'Blocked':
                return Response(
                    {'message': 'This user blocked you, you cannot see his profile', 'status': 'Blocked'},
                    status=status.HTTP_200_OK
                )
            print('api ==> get user profile: User profile found')
            return Response(serializer.data, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            print('api ==> get user profile: User profile not found')
            return Response(
                {'error': 'User profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Internal server error: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
