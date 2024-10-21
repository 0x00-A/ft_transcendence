import random
from uuid import uuid1
from channels.generic.websocket import AsyncWebsocketConsumer
import json

from .global_vars import GlobalData
from .matchmaker import Matchmaker

# Consumer for handling WebSocket connections


class MatchmakingConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # self.player_id = self.scope['user'].id
        # self.player_id = GlobalData.increment_user_id_counter()
        self.player_id = random.randint(1, 100000)
        await self.accept()
        # Register the client when connected
        await Matchmaker.register_client(self.player_id, self)

    async def disconnect(self, close_code):
        # Unregister the client when disconnected
        Matchmaker.games_queue.remove(self.player_id)
        await Matchmaker.unregister_client(self.player_id)

    async def receive(self, text_data):
        data = json.loads(text_data)
        event = data['event']
        if event == 'request_remote_game':
            await Matchmaker.request_remote_game(self.player_id)
        elif event == 'request_tournament':
            tournament_name = data.get('tournament_name')
            number_of_players = int(data.get('number_of_players'))
            await Matchmaker.create_tournament(self.player_id, tournament_name, number_of_players)
        elif event == 'join_tournament':
            tournament_id = data.get('tournament_id')
            await Matchmaker.join_tournament(self.player_id, tournament_id)
        # Handle other events similarly...

    # This method sends a message to the WebSocket client
    async def send_message(self, message):
        await self.send(text_data=json.dumps(message))
