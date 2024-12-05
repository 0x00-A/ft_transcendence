from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated


class UserFriendsView(APIView):
    permission_classes = [IsAuthenticated]
    # serializer_class = UserSerializer

    def get(self, request, username=None):
        if username:
            try:
                user = User.objects.get(username=username)
                friends = user.friends.all()
                serializer = self.serializer_class(friends, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except User.DoesNotExist:
                return Response(
                    {'error': 'User does not exist'},
                    status=status.HTTP_404_NOT_FOUND
                )
            except Exception as e:
                return Response(
                    {'error': 'Internal server error'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        try:
            user = request.user
            friends = user.friends.all()
            serializer = self.serializer_class(friends, many=True)
            return Response(serializer.data)
        except Profile.DoesNotExist:
            return Response(
                {'error': 'User profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': 'Internal server error'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )