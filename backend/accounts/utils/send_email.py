from django.core.mail import send_mail, EmailMultiAlternatives
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags

from accounts.models import EmailVerification, PasswordReset
from accounts.conf import CLIENT_EMAIL_VERIFICATION_URL, CLIENT_RESET_PASSWORD_URL, LOGO_PATH


def send_verification_email(user):
    token = EmailVerification.objects.create(user=user)
    verification_link = f'{CLIENT_EMAIL_VERIFICATION_URL}/{token.token}/'

    print('----verification_link----', verification_link)
    html_message = render_to_string('email_verification.html', context={
        'username': user.username,
        'logo_path': LOGO_PATH,
        'verification_link': verification_link,
    })
    plain_text = strip_tags(html_message)

    print('----logo_path----', LOGO_PATH)

    email = EmailMultiAlternatives(
        subject='-ft-pong- Email Verification',
        body=plain_text,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[user.email],
    )
    email.content_subtype = 'html'
    email.attach_alternative(html_message, 'text/html')
    email.send(fail_silently=False)

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