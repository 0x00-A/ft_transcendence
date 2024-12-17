from django.db.models.signals import post_save
from django.db.models.signals import post_delete, pre_save
from django.contrib.auth.signals import user_logged_in
from django.contrib.auth.signals import user_logged_out
import logging

from django.dispatch import receiver
from accounts.models import User, Achievement, UserAchievement, Notification
from matchmaker.models import Game
from .models import Profile
from .models import Badge

from accounts.consumers import NotificationConsumer


@receiver(pre_save, sender=Profile)
def log_profile_changes(sender, instance, **kwargs):
    if instance.pk:
        old_profile = Profile.objects.get(pk=instance.pk)
        print(f'-----------------Changes applyed to {old_profile.user.username}-----------------')
        if old_profile.score != instance.score:
            print(f"-------------Score changedfrom {old_profile.score} to {instance.score}-------------")
        if old_profile.wins != instance.wins:
            print(f"-------------Wins changed from {old_profile.wins} to {instance.wins}-------------")
        if old_profile.losses != instance.losses:
            print(f"-------------Losses changed from {old_profile.losses} to {instance.losses}-------------")
        if old_profile.level + 1 == instance.level:
            print(f"-------------Level changed from {old_profile.level} to {instance.level}-------------")
            notification = Notification.objects.create(user=instance.user, title='Level Up', message=f"You have reached level {instance.level}")
            notification.save()
            NotificationConsumer.send_notification_to_user(instance.user.id, notification)
        if old_profile.rank != instance.rank:
            print(f"-------------Rank changed from {old_profile.rank} to {instance.rank}---------------")
        if old_profile.badge != instance.badge:
            print(f"-------------Badge changed from {old_profile.badge} to {instance.badge}-------------")

        if 'best_rank' in old_profile.stats and old_profile.stats['best_rank'] != instance.stats['best_rank']:
            print(f"-------------Stats changed from {old_profile.stats['best_rank']} to {instance.stats['best_rank']}-------------")
        # if old_profile.played_games != instance.played_games:
        #     print(f"-------------Played games {old_profile.user.username} changed from {old_profile.played_games} to {instance.played_games}-------------")

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
       Profile.objects.create(user=instance,
                              rank=Profile.objects.count() + 1,
                              badge=Badge.objects.get(name='Bronze'),
                              stats={'wins': 0, 'losses': 0, 'games_played': 0, 'highest_score': 0, 'best_rank': Profile.objects.count() + 1, 'win_track': 0, 'win_streak': 0}
                              )

       achievements = Achievement.objects.all()
       for achievement in achievements:
            user_achievement, created = UserAchievement.objects.get_or_create(user=instance, achievement=achievement)
        # Check if the achievement is already unlocked



@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()


@receiver(post_delete, sender=Profile)
def delete_user_with_profile(sender, instance, **kwargs):
    if instance.user:
        instance.user.delete()

# @receiver(post_save, sender=User)
# def create_profile_badge(sender, instance, created, **kwargs):
#     if created:
#         badge = Badge.objects.get(name='Bronze')
#         instance.profile.badge = badge
#         instance.profile.save()


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


logger = logging.getLogger('django')


# @receiver(user_logged_in)
# def log_user_login(sender, request, user, **kwargs):
#     print(
#         f"User {user.username} logged in from IP {request.META['REMOTE_ADDR']}")
#     logger.info(
#         f"User {user.username} logged in successfully from IP {request.META['REMOTE_ADDR']}")


# @receiver(user_logged_out)
# def log_user_logout(sender, request, user, **kwargs):
#     logger.info(
#         f"User {user.username} logged out successfully from IP {request.META['REMOTE_ADDR']}")


@receiver(user_logged_in)
def track_login_streak(sender, request, user, **kwargs):
    notification = Notification.objects.create(
        user=user, title='Welcome', message=f"Hello, {user.username}! Welcome back.")
    notification.save()
    NotificationConsumer.send_notification_to_user(
        user.id, notification)
    # profile, created = UserProfile.objects.get_or_create(user=user)

    # today = now().date()
    # if profile.last_login_date == today:  # User already logged in today
    #     return

    # # Consecutive day login
    # if profile.last_login_date == today - timedelta(days=1):
    #     profile.login_streak += 1
    # else:  # Break in streak
    #     profile.login_streak = 1

    # profile.last_login_date = today
    # profile.save()

    # # Check if the user qualifies for the achievement
    # if profile.login_streak == 7:
    #     # Award the achievement if not already awarded
    #     if not Achievement.objects.filter(user=user, name="Persistent Player").exists():
    #         Achievement.objects.create(
    #             user=user,
    #             name="Persistent Player",
    #             description="Log in 7 days in a row!"
    #         )
