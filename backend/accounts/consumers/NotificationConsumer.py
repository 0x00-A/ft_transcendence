import json
from channels.generic.websocket import AsyncWebsocketConsumer


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope['user']
        if user.is_authenticated:
            print('api socket ==> NotificationConsumer: User is authenticated connection accepted')
            await self.accept()
            await self.send(text_data=f"Hello {user.username}, you are authenticated!")
        else:
            print('api socket ==> NotificationConsumer: User is not authenticated connection rejected')
            await self.close()

    async def disconnect(self, close_code):
        print('api socket ==> NotificationConsumer: User disconnected')
        return await super().disconnect(close_code)

    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        message = data.get("message", "")


    async def send(self, text_data=None, bytes_data=None, close=False):
        return await super().send(text_data, bytes_data, close)