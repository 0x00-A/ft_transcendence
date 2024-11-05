# from django.db import models
# from .profile import Profile


# class Game(models.Model):
#     game_date = models.DateField()
#     winner = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='won_games')
#     loser = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='lost_games')
#     winner_score = models.CharField()
#     loser_score = models.CharField()

#     def __str__(self) -> str:
#         return f'{self.winner.user.username} vs {self.loser.user.username}'