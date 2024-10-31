from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
from django.utils import timezone
from django.contrib.auth import get_user_model
from accounts.models import Profile
from django.contrib.auth.models import AnonymousUser


User = get_user_model()


class OnlineStatusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']

        if self.user and not isinstance(self.scope['user'], AnonymousUser):
            await self.accept()

            await self.set_online_status(True)
            await self.send(text_data=f"Hello {self.user.username}, you are authenticated!")
        else:
            # Reject the connection if user is not authenticated
            print(f"##################### User not found ##########################")
            await self.close()

    async def disconnect(self, close_code):
        # Mark the user as offline when they disconnect
        if self.user and not self.user.is_anonymous:
            await self.set_online_status(False)

    @database_sync_to_async
    def set_online_status(self, is_online):
        # This function is now synchronous, so no `async` is needed
        profile = Profile.objects.get(user=self.user)
        profile.is_online = is_online
        profile.save()
