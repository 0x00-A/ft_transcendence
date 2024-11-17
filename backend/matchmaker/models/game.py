from django.utils import timezone
from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class GameManager(models.Manager):
    def create_game(self, player1, player2):
        game = self.create(
            player1=player1,
            player2=player2,
        )
        return game

    def get_active_games(self):
        return self.filter(game_status='started')

    def get_completed_games(self):
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
    winner = models.ForeignKey(
        User, related_name='games_as_winner', on_delete=models.CASCADE, null=True)
    p1_score = models.IntegerField(default=0)
    p2_score = models.IntegerField(default=0)
    status = models.CharField(
        max_length=20, choices=GAME_STATUS_CHOICES, default='started')

    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(blank=True, null=True)

    objects = GameManager()

    def save(self, *args, **kwargs):
        if not self.id:
            super().save(*args, **kwargs)
            self.game_id = f"game_{self.id}"
            super().save(update_fields=["game_id"])
        else:
            super().save(*args, **kwargs)

    def start_game(self):
        self.game_status = 'started'
        self.save()

    def end_game(self, winner, p1_score, p2_score):
        print(f"--------------- Game: {self.id} ended -------------------")

        self.winner = self.player1 if winner == 1 else self.player2
        # if winner == 1:
        #     self.player1.profile.update_score(p1_score - p2_score)
        #     self.player2.profile.update_score(p2_score)
        # else:
        #     self.player2.profile.update_score(p2_score - p1_score)
        #     self.player1.profile.update_score(p1_score)
        self.p1_score = p1_score
        self.p2_score = p2_score
        self.status = 'ended'
        self.end_time = timezone.now()
        self.save()

    def update_stats(self):

        for player in [self.player1, self.player2]:
            # Initialize stats
            if 'wins' not in player.profile.stats:
                player.profile.stats['wins'] = 0
            if 'losses' not in player.profile.stats:
                player.profile.stats['losses'] = 0
            if 'games_played' not in player.profile.stats:
                player.profile.stats['games_played'] = 0
            player.save()

        self.player1.profile.stats['games_played'] += 1
        self.player2.profile.stats['games_played'] += 1

        if self.winner == self.player1:
            self.player1.profile.stats['wins'] += 1
            self.player2.profile.stats['losses'] += 1
        elif self.winner == self.player2:
            self.player2.profile.stats['wins'] += 1
            self.player1.profile.stats['losses'] += 1

        current_day = self.end_time.strftime('%a')
        duration = (self.end_time -
                    self.start_time).total_seconds() / 3600.0
        print(
            f'start: {self.start_time} - end: {self.end_time} - DURATION: {duration}')

        for player in [self.player1, self.player2]:
            stats = player.profile.stats.get('performanceData', [])
            day_found = False

            for entry in stats:
                if current_day in entry:
                    entry[current_day] += duration
                    day_found = True
                    break

            if not day_found:
                stats.append({current_day: duration})

            player.profile.stats["performanceData"] = stats
            # player.profile.save()


        self.player1.save()
        self.player2.save()
