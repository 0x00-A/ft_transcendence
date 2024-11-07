import json
from channels.generic.websocket import AsyncWebsocketConsumer
# from django.contrib.auth import get_user_model

# User = get_user_model()

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope['user']
        if user.is_authenticated:
            print(f"##################### User is Authenticated ##########################")
            await self.accept()
            await self.send(text_data=f"Hello {user.username}, you are authenticated!")
        else:
            # Reject the connection if user is not authenticated
            print(f"##################### User is Anounymous ##########################")
            await self.close()

    async def disconnect(self, close_code):
        return await super().disconnect(close_code)

    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        print("##################### Data ##########################", data)

        message = data.get("message", "")

        # await self.send(text_data=json.dumps({"message": message}))

    async def send(self, text_data=None, bytes_data=None, close=False):

        return await super().send(text_data, bytes_data, close)