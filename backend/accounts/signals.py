from django.db.models.signals import post_save
from django.db.models.signals import post_delete
from django.dispatch import receiver
from accounts.models import User
from .models import Profile


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()


@receiver(post_delete, sender=Profile)
def delete_user_with_profile(sender, instance, **kwargs):
    if instance.user:
        instance.user.delete()
