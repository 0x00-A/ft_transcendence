from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
import os


class Command(BaseCommand):
    help = "Automatically creates a superuser if one does not exist"

    def handle(self, *args, **kwargs):
        User = get_user_model()
        username = os.getenv("ADMIN_USERNAME", "admin")
        email = os.getenv("ADMIN_EMAIL", "admin@example.com")
        password = os.getenv("ADMIN_PASS", "admin123456")

        try:
            # Check if the superuser already exists
            User.objects.get(username=username)
            self.stdout.write(self.style.WARNING(
                f"Superuser already exists."))
        except ObjectDoesNotExist:
            # Create the superuser if it doesn't exist
            User.objects.create_superuser(
                username=username, email=email, password=password)
            self.stdout.write(self.style.SUCCESS(
                f"Superuser created successfully."))
