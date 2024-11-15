import json
from channels.generic.websocket import AsyncWebsocketConsumer
# from django.contrib.auth import get_user_model

# User = get_user_model()

# class NotificationConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         user = self.scope['user']
#         if user.is_authenticated:
#             print(f"##################### User is Authenticated ##########################")
#             await self.accept()
#             await self.send(text_data=f"Hello {user.username}, you are authenticated!")
#         else:
#             # Reject the connection if user is not authenticated
#             print(f"##################### User is Anounymous ##########################")
#             await self.close()

#     async def disconnect(self, close_code):
#         return await super().disconnect(close_code)

#     async def receive(self, text_data=None, bytes_data=None):
#         data = json.loads(text_data)
#         print("##################### Data ##########################", data)

#         message = data.get("message", "")

#         # await self.send(text_data=json.dumps({"message": message}))

#     async def send(self, text_data=None, bytes_data=None, close=False):

#         return await super().send(text_data, bytes_data, close)

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from accounts.models import User
from matchmaker.models.game import Game
from matchmaker.matchmaker import Matchmaker
from django.db.models import Q


connected_users = {}


class NotificationConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        user = self.scope['user']
        self.username = None

        if user.is_authenticated:
            await self.accept()
            self.username = user.username
            self.id = user.id
            connected_users[self.username] = self.channel_name
        else:
            await self.close()

    async def receive(self, text_data):
        data = json.loads(text_data)
        event = data['event']
        print(f'Notication Websocket Message Recieved: {event}')
        if event == 'game_invite':
            await self.handle_invite(self.username, data.get('to'))
        if event == 'invite_accept':
            await self.handle_accept(data.get('from'), self.username)
        if event == 'invite_reject':
            await self.handle_reject(data.get('from'), self.username)

    async def disconnect(self, close_code):
        if self.username in connected_users:
            del connected_users[self.username]

    async def handle_accept(self, sender, recipient):
        if await self.is_already_playing(sender):
            message = {
                'event': 'error',
                'message': f"{sender} is currently playing!"

            }
            await self.send_message(recipient, message)
            return
        # player1_id = await self.get_user_id(sender)
        # player2_id = await self.get_user_id(sender)

        # if player1_id and player2_id:
        print(f"creating game... p1: {sender} | p2: {recipient}")
        # Store the game in your database (using Django ORM models)
        # User = get_user_model()
        p1 = await User.objects.aget(username=sender)
        p2 = await User.objects.aget(username=recipient)
        game = await Game.objects.acreate(
            player1=p1, player2=p2
        )
        game_address = f"game/game_{game.id}"
        # Simulate game creation with game_id and address
        # game_id = await cls.get_new_game_id()

        # Send the game address to both players
        message = {
            'event': 'game_address',
            'message': 'Game successfully created',
            'game_address': game_address,
        }
        await self.send_message(sender, message)
        await self.send_message(recipient, message)

    async def is_already_playing(self, sender):
        user_id = await self.get_user_id(sender)
        if user_id:
            if user_id in Matchmaker.games_queue:
                Matchmaker.games_queue.remove(user_id)
                return False
            if await Game.objects.filter(
                (Q(player1=user_id) | Q(player2=user_id)) & Q(
                    status="started")
            ).aexists():
                return True
            return False

    async def handle_reject(self, sender, recipient):
        message = {
            "event": "invite_reject",
            "to": recipient,
            "message": f"The invitation has expired or rejected.",
        }
        await self.send_message(sender, message)

    async def handle_invite(self, sender, recipient):

        invite_message = {
            "event": "game_invite",
            "from": sender,
            "message": "recieved invite.",
        }

        if recipient in connected_users:
            print(f'Recipient found sending invite...')
            if await self.is_already_playing(recipient):
                await self.send_message(sender, {
                    "event": "error",
                    "message": f"{recipient} is in a game!",
                })
            else:
                await self.send_message(recipient, invite_message)
        else:
            print(f'Recipient not found ... {sender}')
            await self.send_message(sender, {
                "event": "error",
                "message": "The recipient is currently offline.",
            })

    async def send_message(self, username, message):
        channel_layer = get_channel_layer()
        channel_name = connected_users.get(
            username)

        if channel_name:
            await channel_layer.send(
                channel_name,
                {
                    "type": "user.message",
                    "message": message,
                }
            )
        else:
            print("NotificationsConsumer: User is not connected.")

    async def user_message(self, event):
        message = event["message"]

        # Send the message to the WebSocket
        await self.send(text_data=json.dumps(message))

    async def get_user_id(self, username):
        try:
            user = await User.objects.aget(username=username)
            return user.id
        except User.DoesNotExist:
            return None
