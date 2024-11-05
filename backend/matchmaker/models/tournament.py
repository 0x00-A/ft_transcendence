from django.utils import timezone
from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


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
    number_of_players = models.IntegerField(default=8)
    created_at = models.DateTimeField(default=timezone.now)

    status = models.CharField(
        max_length=20, choices=TOURNAMENT_STATUS_CHOICES, default='waiting')
    winner = models.ForeignKey(
        User, related_name='won_tournaments', on_delete=models.CASCADE, null=True)
    players = models.ManyToManyField(User, related_name='tournaments')
    current_match_index = models.IntegerField(default=0)
    is_full = models.BooleanField(default=False)

    objects = TournamentManager()

    def check_if_full(self):
        if self.participants.count() >= self.max_participants:
            self.is_full = True
            self.save()
            return True
        return False

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

    # def generate_matches(self):
    #     players = list(self.players.all())
    #     matches = combinations(players, 2)
    #     for match in matches:
    #         game_id = f"game_{self.id}_{self.matches.count() + 1}"
    #         Game.objects.create(
    #             game_id=game_id,
    #             tournament=self,
    #             player1=match[0].player_id,
    #             player2=match[1].player_id,
    #             game_status='waiting'
    #         )

    def end_tournament(self):
        self.status = 'ended'
        self.save()

    def abort_tournament(self):
        self.status = 'aborted'
        self.winner = None
        self.save()

    def __str__(self):
        return f"Tournament {self.name} - Status: {self.status}"
