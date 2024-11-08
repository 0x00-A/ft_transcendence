from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Match, Tournament
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
