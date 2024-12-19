from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Match, Tournament
from accounts.consumers import NotificationConsumer
from accounts.models import User, Notification
from accounts.utils import translate_text


# @receiver(post_save, sender=Match)
# def check_round_completion(sender, instance, **kwargs):
#     # Only proceed if this match has just been marked as completed
#     if instance.status == 'ended':
#         tournament = instance.tournament

#         # Check if we need to progress to the next round or finalize the tournament
#         if not tournament.matches.filter(status='waiting').exists():
#             # No more waiting matches in the current round
#             if tournament.matches.filter(status='ended').count() == tournament.number_of_players // 2:
#                 # Trigger next round if we're at the end of the current round
#                 tournament.progress_to_next_round()
#             elif tournament.matches.filter(status='completed').count() == tournament.number_of_players - 1:
#                 # Finalize if all matches in the tournament are complete
#                 tournament.finalize_tournament()


@receiver(post_save, sender=Match)
def notify_players_on_match_creation(sender, instance, created, **kwargs):
    if created:
        player1 = instance.player1
        player2 = instance.player2

        # message = {
        #     "title": "Match Notification",
        #     "content": f"You are scheduled for the next round in Tournament {instance.tournament.name}!",
        #     "match_id": instance.match_id,
        # }
                        # set notification
        target_language = 'es'
        # target_language = receiver.preferred_language
        try:
            translated_message = translate_text(f"You are scheduled for the next round in Tournament {instance.tournament.name}!",target_language)
            translated_title = translate_text(f"Match Notification",target_language)
        except Exception as e:
            translated_message = f"You are scheduled for the next round in Tournament {instance.tournament.name}!"
            translated_title = translate_text(f"Match Notification",target_language)
        notification = Notification.objects.create(
            user=player1, title=translated_title, message=translated_message)
        notification.save()
        NotificationConsumer.send_notification_to_user(
            player1.id, notification)
        
        notification = Notification.objects.create(
            user=player2, title=translated_title, message=translated_message)
        notification.save()
        NotificationConsumer.send_notification_to_user(
            player2.id, notification)
