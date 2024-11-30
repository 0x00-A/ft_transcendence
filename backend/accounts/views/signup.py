from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.response import Response
from django.shortcuts import redirect
from ..serializers import UserRegisterSerializer
from ..models import EmailVerification
from rest_framework.decorators import api_view, permission_classes
from urllib.parse import quote
from uuid import UUID
from app.settings import SERVER_URL


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_email(request):
    if 'token' not in request.data:
        return Response({'error': 'Token is required!'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        UUID(request.data.get('token'), version=4)
    except ValueError:
        return Response({'error': 'Invalid token!'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        verify = EmailVerification.objects.get(token=request.data.get('token'))
    except EmailVerification.DoesNotExist:
        return Response({'error': 'Invalid token, your account is not verified!'}, status=status.HTTP_400_BAD_REQUEST)
        return redirect(f"{SERVER_URL}/auth?status=failed&error={quote('Invalid token, your account is not verified!')}")
    user = verify.user
    user.is_active = True
    user.save()
    verify.delete()
    return Response({'message': 'Your account has been verified, you can login now!'}, status=status.HTTP_200_OK)
    return redirect(f"{SERVER_URL}/auth?status=success&message={quote('Your account has been verified, you can login now!')}")


class SignupView(CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserRegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        message = 'Your account has been created, an activation link has been sent to your email.'
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
