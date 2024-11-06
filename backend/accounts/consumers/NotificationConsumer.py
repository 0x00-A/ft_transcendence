import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import AnonymousUser


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        if self.user and not isinstance(self.scope['user'], AnonymousUser):
            await self.accept()
            await self.send(text_data=f"Hello {self.user.username}, you are authenticated!")
        else:
            # Reject the connection if user is not authenticated
            print(f"##################### User not found ##########################")
            await self.close()

    async def disconnect(self, close_code):
        return await super().disconnect(close_code)

    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        message = data.get("message", "")
        await self.send(text_data=json.dumps({"message": message}))

    async def send(self, text_data=None, bytes_data=None, close=False):

        return await super().send(text_data, bytes_data, close)