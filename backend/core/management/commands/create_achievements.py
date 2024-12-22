from django.core.management.base import BaseCommand
from accounts.models import Achievement


class Command(BaseCommand):
    help = "Create global achievements"

    def handle(self, *args, **kwargs):
        achievements = [
            {"name": "First Paddle", "description": "Win your first match.",
                "image": "/icons/first_paddle.png", "threshold": 1, "condition_name": "games_won", "condition": {"games_won": 1}},


            {"name": "Persistent Player", "description": "Log in 7 days in a row!",
                "image": "/icons/rookie.png", "threshold": 7, "condition_name": "logins", "condition": {"logins": 7}},

                
            {"name": "Bronze Champ", "description": "Win 5 matches.",
                "image": "/icons/bronze_champ.png", "threshold": 5, "condition_name": "games_won", "condition": {"games_won": 5}},

                
            {"name": "Silver Smash", "description": "Win 10 matches.",
                "image": "/icons/silver_smash.png", "threshold": 10, "condition_name": "games_won", "condition": {"games_won": 10}},

                
            {"name": "Gold Ace", "description": "Win 20 matches.",
                "image": "/icons/gold_ace.png", "threshold": 20, "condition_name": "games_won", "condition": {"games_won": 20}},

                
            {"name": "Marathon Match", "description": "Play a match lasting more than 5 minutes.",
                "image": "/icons/marathon_match.png", "threshold": 300, "condition_name": "play_time", "condition": {"play_time": 300}},

                
            {"name": "FT-PONG Legend", "description": "Win 50 matches",
                "image": "/icons/legend.png", "threshold": 100, "condition_name": "games_won", "condition": {"games_won": 50}}
        ]
        for achievement in achievements:
            Achievement.objects.get_or_create(**achievement)
        self.stdout.write(self.style.SUCCESS(
            'Achievements created successfully!'))
