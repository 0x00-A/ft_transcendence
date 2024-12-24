import random
from uuid import uuid1
from channels.generic.websocket import AsyncWebsocketConsumer
import json
from accounts.models import Profile
from asgiref.sync import sync_to_async
from django.contrib.auth.models import AnonymousUser

from .matchmaker import Matchmaker


class MatchmakingConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope['user']
        self.player_id = None

        if user and not isinstance(user, AnonymousUser):
            await self.accept()
            self.player_id = user.id
            await Matchmaker.register_client(self.player_id, self.channel_name)
        else:
            await self.close()

    async def disconnect(self, close_code):
        await Matchmaker.handle_player_unready(self.player_id)
        await Matchmaker.unregister_client(self.player_id, self.channel_name)
        return await super().disconnect(close_code)

    async def receive(self, text_data):
        data = json.loads(text_data)
        event = data['event']
        print(f'Websocket Message Recieved: {event}')
        if event == 'request_remote_game':
            await Matchmaker.request_remote_game(self.player_id)
        elif event == 'request_multiple_game':
            await Matchmaker.request_multi_game(self.player_id)
        elif event == 'request_tournament':
            tournament_name = data.get('tournament_name')
            await Matchmaker.create_tournament(self.player_id, tournament_name)
        elif event == 'join_tournament':
            tournament_id = data.get('tournament_id')
            await Matchmaker.join_tournament(self.player_id, tournament_id)
        elif event == 'player_ready':
            await Matchmaker.handle_player_ready(self.player_id, data.get('match_id'))
        elif event == 'player_unready':
            await Matchmaker.handle_player_unready(self.player_id)
        elif event == 'remove_from_queue':
            await Matchmaker.remove_from_queue(self.player_id)
        elif event == 'player_left':
            await Matchmaker.leave_tournament(self.player_id)

    async def user_message(self, event):
        message = event["message"]

        await self.send(text_data=json.dumps(message))
