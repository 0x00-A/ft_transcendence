from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Match, Tournament
from accounts.consumers import NotificationConsumer
from accounts.models import User, Notification


# from .tournament_logic import progress_to_next_round, finalize_tournament


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
        # Fetch player usernames or IDs
        player1 = instance.player1
        player2 = instance.player2

        # Prepare the notification message
        # message = {
        #     "title": "Match Notification",
        #     "content": f"You are scheduled for the next round in Tournament {instance.tournament.name}!",
        #     "match_id": instance.match_id,
        # }
        notification = Notification.objects.create(
            user=player1, title='Match Notification', message=f"You are scheduled for the next round in Tournament {instance.tournament.name}!")
        notification.save()
        NotificationConsumer.send_notification_to_user(
            player1.id, notification)
        notification = Notification.objects.create(
            user=player2, title='Match Notification', message=f"You are scheduled for the next round in Tournament {instance.tournament.name}!")
        notification.save()
        NotificationConsumer.send_notification_to_user(
            player2.id, notification)
        # Send real-time notifications using WebSockets
        # channel_layer = get_channel_layer()
        # if channel_layer:
        # Notify player 1
        # if player1.username in connected_users:
        #     async_to_sync(channel_layer.send)(
        #         connected_users[player1.username],
        #         {
        #             "type": "user.message",
        #             "message": message,
        #         },
        #     )
        # Notify player 2
        # if player2.username in connected_users:
        #     async_to_sync(channel_layer.send)(
        #         connected_users[player2.username],
        #         {
        #             "type": "user.message",
        #             "message": message,
        #         },
        #     )
