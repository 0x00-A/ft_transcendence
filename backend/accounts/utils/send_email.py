from django.core.mail import send_mail, EmailMultiAlternatives
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags

from accounts.models import EmailVerification, PasswordReset, Notification
from accounts.conf import CLIENT_EMAIL_VERIFICATION_URL, CLIENT_RESET_PASSWORD_URL, LOGO_PATH, CLIENT_URL
from accounts.consumers import NotificationConsumer


def send_verification_email(user):
    token = EmailVerification.objects.create(user=user)
    verification_link = f'{CLIENT_EMAIL_VERIFICATION_URL}/{token.token}/'

    html_message = render_to_string('email_verification.html', context={
        'username': user.username,
        # 'logo_path': LOGO_PATH,
        'logo_path': "https://static.vecteezy.com/system/resources/previews/014/692/147/non_2x/table-tennis-rackets-with-ball-illustration-on-white-background-table-tennis-and-ping-pong-rackets-with-ball-logo-vector.jpg",
        'verification_link': verification_link,
    })

    plain_text = strip_tags(html_message)
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

    html_message = render_to_string('reset_password.html', context={
        'username': user.username,
        # 'logo_path': LOGO_PATH,
        'logo_path': "https://static.vecteezy.com/system/resources/previews/014/692/147/non_2x/table-tennis-rackets-with-ball-illustration-on-white-background-table-tennis-and-ping-pong-rackets-with-ball-logo-vector.jpg",
        'resetpass_link': resetpass_link,
    })

    plain_text = strip_tags(html_message)
    email = EmailMultiAlternatives(
        subject='-ft-pong- Reset Your Password',
        body=plain_text,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[user.email],
    )
    email.content_subtype = 'html'
    email.attach_alternative(html_message, 'text/html')
    email.send(fail_silently=False)

def send_oauth2_welcome(user, choice:str):
    html_message = render_to_string('oauth2_welcome.html', context={
        'username': user.username,
        'choice': choice,
        # 'logo_path': LOGO_PATH,
        'logo_path': "https://static.vecteezy.com/system/resources/previews/014/692/147/non_2x/table-tennis-rackets-with-ball-illustration-on-white-background-table-tennis-and-ping-pong-rackets-with-ball-logo-vector.jpg",
        'website_link': CLIENT_URL,
    })

    plain_text = strip_tags(html_message)
    email = EmailMultiAlternatives(
        subject='-ft-pong- Welcome Player',
        body=plain_text,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[user.email],
    )
    email.content_subtype = 'html'
    email.attach_alternative(html_message, 'text/html')
    email.send()

    notification = Notification.objects.create(user=user, title='Welcome',
                message=f"Hello, {user.username}! Please set a password so you can edit your profile and sign in using your username and password (enter to your profile and click in Edit Profile in the top).")
    notification.save()
    NotificationConsumer.send_notification_to_user(user.id, notification)

# def send_otp_email(user):
#     send_mail(
#         'Your 2FA Code',
#         f'Your one-time code is: {user.otp_secret}',
#         'mahdimardi18@gmail.com',
#         [user.email],
#         fail_silently=False,
#     )



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