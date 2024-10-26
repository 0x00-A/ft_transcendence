from datetime import timezone
from itertools import combinations
from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()

#
# to add in User model
# stats = models.JSONField(default=dict, blank=True)
#


class GameManager(models.Manager):
    def create_game(self, player1, player2, game_address):
        """
        Custom method to create a new game instance.
        """
        game = self.create(
            player1=player1,
            player2=player2,
            game_address=game_address,
            game_start_time=timezone.now(),
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
        ('waiting', 'Game Waiting'),
        ('started', 'Game started'),
        ('ended', 'Game ended'),
        ('aborted', 'Game aborted'),
    ]
    # player1 = models.ForeignKey(
    #     User, related_name='games_as_player1', on_delete=models.CASCADE)
    # player2 = models.ForeignKey(
    #     User, related_name='games_as_player2', on_delete=models.CASCADE)
    game_id = models.CharField(max_length=100, unique=True)

    tournament = models.ForeignKey(
        'Tournament', on_delete=models.CASCADE, related_name='matches')
    player1_id = models.IntegerField()
    player2_id = models.IntegerField()
    winner = models.ForeignKey(
        User, related_name='games_as_winner', on_delete=models.CASCADE, null=True)
    p1_score = models.IntegerField(default=0)
    p2_score = models.IntegerField(default=0)
    status = models.CharField(
        max_length=20, choices=GAME_STATUS_CHOICES, default='waiting')

    start_time = models.DateTimeField(auto_now=True)
    end_time = models.DateTimeField(blank=True, null=True)
    game_address = models.URLField(max_length=200)

    objects = GameManager()

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

    def end_game(self, winner, p1_score, p2_score):
        """
        End the game, store the winner, and update win stats.
        """
        self.game_winner = winner
        self.p1_score = p1_score
        self.p2_score = p2_score
        self.game_status = 'ended'
        self.end_time = timezone.now()
        self.save()

    def abort_game(self):
        """
        Abort the game and mark it as aborted.
        """
        self.game_status = 'aborted'
        self.game_winner = -1
        self.game_end_time = timezone.now()
        self.save()

    def __str__(self):
        return f"Game {self.id} ({self.status})"


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

    # creator = models.ForeignKey(User, on_delete=models.CASCADE)
    creator = models.CharField(max_length=100)

    name = models.CharField(max_length=100)
    number_of_players = models.IntegerField()
    start_time = models.DateTimeField(default=timezone.now)
    end_time = models.DateTimeField(blank=True, null=True)

    status = models.CharField(max_length=20)
    winner = models.ForeignKey(
        User, related_name='won_tournaments', on_delete=models.CASCADE, null=True)
    players = models.ManyToManyField(User, related_name='tournaments')
    current_match_index = models.IntegerField(default=0)

    objects = TournamentManager()

    def join_tournament(self, player):
        if self.players.count() < self.number_of_players:
            self.players.add(player)
            return True
        return False

    def start_tournament(self):
        if self.players.count() == self.number_of_players:
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
                tournament=self,  # Link the match to the tournament
                player1=match[0].player_id,
                player2=match[1].player_id,
                game_status='waiting'
            )

    def end_tournament(self):
        self.status = 'ended'
        self.end_time = timezone.now()
        self.save()

    def abort_tournament(self):
        self.status = 'aborted'
        self.winner = None
        self.end_time = timezone.now()
        self.save()

    def calculate_winner(self):
        win_counts = {player: 0 for player in self.players.all()}
        matches = self.matches.filter(status='completed')
        for match in matches:
            if match.winner:
                win_counts[match.winner] += 1

        max_wins = max(win_counts.values())
        if list(win_counts.values()).count(max_wins) > 1:
            draw_players = [player for player,
                            wins in win_counts.items() if wins == max_wins]
            self.generate_draw_matches(draw_players)
            return False
        else:
            self.winner = max(win_counts, key=win_counts.get)
            self.end_tournament()
            return True

    def __str__(self):
        return f"Tournament {self.name} - Status: {self.status}"
