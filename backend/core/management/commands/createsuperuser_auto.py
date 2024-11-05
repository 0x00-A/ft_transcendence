from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist


class Command(BaseCommand):
    help = "Automatically creates a superuser if one does not exist"

    def handle(self, *args, **kwargs):
        User = get_user_model()
        username = "admin"
        email = "admin@example.com"
        password = "admin123456"

        try:
            # Check if the superuser already exists
            User.objects.get(username=username)
            self.stdout.write(self.style.WARNING(
                f"Superuser '{username}' already exists."))
        except ObjectDoesNotExist:
            # Create the superuser if it doesn't exist
            User.objects.create_superuser(
                username=username, email=email, password=password)
            self.stdout.write(self.style.SUCCESS(
                f"Superuser '{username}|{password}' created successfully."))
