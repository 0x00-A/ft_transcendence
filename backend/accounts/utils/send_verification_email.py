from django.core.mail import send_mail
from django.conf import settings
from accounts.conf import CLIENT_EMAIL_VERIFICATION_URL, CLIENT_RESET_PASSWORD_URL

from accounts.models import EmailVerification, PasswordReset


def send_verification_email(user):
    token = EmailVerification.objects.create(user=user)
    verification_link = f'{CLIENT_EMAIL_VERIFICATION_URL}/{token.token}/'
    send_mail(
        'Verify your email',
        f'Click on the link to verify your email: {verification_link}',
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )

def send_reset_password_email(user):
    token = PasswordReset.objects.create(user=user)
    resetpass_link = f'{CLIENT_RESET_PASSWORD_URL}/{token.token}/'
    send_mail(
        'Reset your password',
        f'Click on the link to reset your password: {resetpass_link}',
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )

def generate_otp():
    return random.randint(100000, 999999)


def send_otp_email(user):
    send_mail(
        'Your 2FA Code',
        f'Your one-time code is: {user.otp_secret}',
        'mahdimardi18@gmail.com',
        [user.email],
        fail_silently=False,
    )



    # def send_verification_email(user, email):
    # token = EmailVerification.objects.create(user=user, new_email=email)
    # verification_link = f'http://localhost:3000/profile/{token.token}/'
    # send_mail(
    #     'Verify your email',
    #     f'Click on the link to verify your email: {verification_link}',
    #     settings.DEFAULT_FROM_EMAIL,
    #     [email],
    #     fail_silently=False,
    # )