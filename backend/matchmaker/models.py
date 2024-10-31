from django.utils import timezone
from itertools import combinations
from django.contrib.auth import get_user_model
from django.db import models
from accounts.models import Profile

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
        ('aborted', 'Game aborted'),
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
        if not self.game_id:
            self.game_id = f"game_{self.id}"
        super().save(*args, **kwargs)

    # def join_game(self, player, client):
    #     """
    #     Player joins the game if the second player slot is empty.
    #     """
    #     if not self.player2:
    #         self.player2 = player
    #         self.client2 = client
    #         self.save()
    #         return True
    #     return False

    def start_game(self):
        """
        Set the game status to 'started'.
        """
        self.game_status = 'started'
        self.save()

    def end_game(self, winner_id, p1_score=None, p2_score=None):
        """
        End the game, store the winner, and update win stats.
        """
        winner = User.objects.get(id=winner_id)
        self.winner = winner
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


class Match(models.Model):
    GAME_STATUS_CHOICES = [
        ('waiting', 'Game Waiting'),
        ('started', 'Game started'),
        ('ended', 'Game ended'),
        ('aborted', 'Game aborted'),
    ]
    player1 = models.ForeignKey(
        User, related_name='matches_as_player1', on_delete=models.CASCADE)
    player2 = models.ForeignKey(
        User, related_name='matches_as_player2', on_delete=models.CASCADE)
    match_id = models.CharField(
        max_length=100, unique=True, blank=True, null=True)
    tournament = models.ForeignKey(
        'Tournament', on_delete=models.CASCADE, related_name='matches', null=True)
    winner = models.ForeignKey(
        User, related_name='matches_as_winner', on_delete=models.CASCADE, null=True)
    p1_score = models.IntegerField(default=0)
    p2_score = models.IntegerField(default=0)
    status = models.CharField(
        max_length=20, choices=GAME_STATUS_CHOICES, default='waiting')

    start_time = models.DateTimeField(auto_now=True)
    end_time = models.DateTimeField(blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.match_id:
            self.match_id = f"match_{self.id}"
        super().save(*args, **kwargs)


class TournamentManager(models.Manager):
    def active_tournaments(self):
        return self.filter(status='active')


class Tournament(models.Model):
    TOURNAMENT_STATUS_CHOICES = [
        ('waiting', 'Waiting for players'),
        ('ongoing', 'Ongoing'),
        ('ended', 'Ended'),
        ('aborted', 'Aborted'),
    ]

    creator = models.ForeignKey(
        User, related_name='created_tournaments', on_delete=models.CASCADE)
    # creator = models.CharField(max_length=100)

    name = models.CharField(max_length=100)
    number_of_players = models.IntegerField()
    created_at = models.DateTimeField(default=timezone.now)

    status = models.CharField(
        max_length=20, choices=TOURNAMENT_STATUS_CHOICES, default='waiting')
    winner = models.ForeignKey(
        User, related_name='won_tournaments', on_delete=models.CASCADE, null=True)
    players = models.ManyToManyField(User, related_name='tournaments')
    max_players = models.IntegerField()
    current_match_index = models.IntegerField(default=0)

    objects = TournamentManager()

    def join_tournament(self, player):
        if self.players.count() < self.number_of_players:
            self.players.add(player)
            return True
        return False

    def start_tournament(self):
        if self.players.count() == self.max_players:
            self.status = 'ongoing'
            self.save()
            self.generate_matches()

    def generate_matches(self):
        players = list(self.players.all())
        matches = combinations(players, 2)
        for match in matches:
            game_id = f"game_{self.id}_{self.matches.count() + 1}"
            Game.objects.create(
                game_id=game_id,
                tournament=self,
                player1=match[0].player_id,
                player2=match[1].player_id,
                game_status='waiting'
            )

    def end_tournament(self):
        self.status = 'ended'
        self.save()

    def abort_tournament(self):
        self.status = 'aborted'
        self.winner = None
        self.save()

    def __str__(self):
        return f"Tournament {self.name} - Status: {self.status}"
