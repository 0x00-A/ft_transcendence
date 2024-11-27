from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.response import Response
from ..serializers import UserRegisterSerializer
from ..models import EmailVerification
from rest_framework.decorators import api_view, permission_classes



@api_view(['GET'])
@permission_classes([AllowAny])
def verify_email(request, token):
    try:
        verify = EmailVerification.objects.get(token=token)
    except EmailVerification.DoesNotExist:
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
    user = verify.user
    user.is_active = True
    user.save()
    verify.delete()
    return Response({'message': 'Email verified'}, status=status.HTTP_200_OK)


class SignupView(CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserRegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        message = 'Your account has been created, an activation link has been sent to your email.';
        print('api ==> signup: User account created')
        return Response(data={'message': message}, status=status.HTTP_201_CREATED, headers=headers)


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