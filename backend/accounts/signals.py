from django.db.models.signals import post_save
from django.db.models.signals import post_delete
from django.dispatch import receiver
from accounts.models import User, Achievement, UserAchievement, Notification
from matchmaker.models import Game
from .models import Profile

from accounts.consumers import NotificationConsumer


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


# @receiver(post_save, sender=Game)
# def check_achievements_on_game_win(sender, instance, **kwargs):
#     if instance.winner:
#         user = instance.winner
#         achievements = Achievement.objects.filter(
#             condition__contains={"games_won": 1})
#         for achievement in achievements:
#             user_achievement, created = UserAchievement.objects.get_or_create(
#                 user=user, achievement=achievement)
#             if not user_achievement.is_unlocked:
#                 progress = user_achievement.progress.get("games_won", 0) + 1
#                 user_achievement.progress["games_won"] = progress
#                 if progress >= achievement.condition["games_won"]:
#                     user_achievement.is_unlocked = True
#                     # Send notification
#                     send_achievement_notification(user, achievement)
#                 user_achievement.save()


@receiver(post_save, sender=Game)
def unlock_achievements_on_game(sender, instance, **kwargs):
    if not instance.winner:
        return
    user = instance.winner
    achievements = Achievement.objects.filter(condition__has_key="games_won")

    for achievement in achievements:
        # Check if the achievement is already unlocked
        user_achievement, created = UserAchievement.objects.get_or_create(
            user=user, achievement=achievement)

        if not user_achievement.is_unlocked:
            # Update progress
            user_achievement.progress["games_won"] = user_achievement.progress.get(
                "games_won", 0) + 1
            if user_achievement.progress["games_won"] >= achievement.condition["games_won"]:
                user_achievement.is_unlocked = True

                notification = Notification.objects.create(
                    user=user, title='Achievement unlocked', message=f"Achievement {achievement.name} unlocked")
                notification.save()
                NotificationConsumer.send_notification_to_user(
                    user.id, notification)
            user_achievement.save()
