from django.utils import timezone
from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class GameManager(models.Manager):
    def create_game(self, player1, player2):
        """
        Custom method to create a new game instance.
        """
        game = self.create(
            player1=player1,
            player2=player2,
        )
        return game

    def get_active_games(self):
        """
        Return all active games that have started but not yet ended.
        """
        return self.filter(game_status='started')

    def get_completed_games(self):
        """
        Return all games that have ended.
        """
        return self.filter(game_status='ended')


class Game(models.Model):
    GAME_STATUS_CHOICES = [
        ('started', 'Game started'),
        ('ended', 'Game ended'),
    ]
    game_id = models.CharField(
        max_length=100, unique=True, blank=True, null=True)
    player1 = models.ForeignKey(
        User, related_name='games_as_player1', on_delete=models.CASCADE)
    player2 = models.ForeignKey(
        User, related_name='games_as_player2', on_delete=models.CASCADE)

    # tournament = models.ForeignKey(
    #     'Tournament', on_delete=models.CASCADE, related_name='matches', null=True)
    winner = models.ForeignKey(
        User, related_name='games_as_winner', on_delete=models.CASCADE, null=True)
    p1_score = models.IntegerField(default=0)
    p2_score = models.IntegerField(default=0)
    status = models.CharField(
        max_length=20, choices=GAME_STATUS_CHOICES, default='started')

    start_time = models.DateTimeField(auto_now=True)
    end_time = models.DateTimeField(blank=True, null=True)
    # game_address = models.URLField(max_length=200)

    objects = GameManager()

    def save(self, *args, **kwargs):
        if not self.id:
            super().save(*args, **kwargs)
            self.game_id = f"game_{self.id}"
            super().save(update_fields=["game_id"])
        else:
            super().save(*args, **kwargs)

    def start_game(self):
        """
        Set the game status to 'started'.
        """
        self.game_status = 'started'
        self.save()

    def end_game(self, winner, p1_score, p2_score):
        """
        End the game, store the winner, and update win stats.
        """
        print(f"--------------- Game: {self.id} ended -------------------")

        self.winner = self.player1 if winner == 1 else self.player2
        self.p1_score = p1_score
        self.p2_score = p2_score
        self.status = 'ended'
        self.end_time = timezone.now()
        self.save()

    def abort_game(self):
        """
        Abort the game and mark it as aborted.
        """
        print(f"--------------- Game: {self.id} aborted -------------------")
        self.game_status = 'aborted'
        self.game_winner = -1
        self.game_end_time = timezone.now()
        self.save()

    def __str__(self):
        return f"Game {self.id} ({self.status})"
