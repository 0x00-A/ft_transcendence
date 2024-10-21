import json
from channels.layers import get_channel_layer
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer

# Global variables
connected_clients = {}
# Managing multiple game instances
games = {}

# Client class for handling clients


class Client:
    def __init__(self, player_id, websocket):
        self.player_id = player_id
        self.websocket = websocket


class MatchMakingConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        # Create a unique client identifier
        self.client_id = self.scope['user'].id if self.scope['user'].is_authenticated else self.channel_name

        # Track the connected client
        connected_clients[self.client_id] = self

        # Accept the connection
        await self.accept()

    async def disconnect(self, close_code):
        # Remove the client from connected_clients dictionary
        if self.client_id in connected_clients:
            del connected_clients[self.client_id]

        # Remove the client from the group
        await self.channel_layer.group_discard("waiting_room", self.channel_name)

    async def receive(self, text_data):
        # Handle received WebSocket message
        try:
            data = json.loads(text_data)
            print(f"Received message from player {self.player_id}: {data}")

            action = data.get('action')

            if action == 'request_single_game':
                await self.request_single_game()
            elif action == 'request_tournament':
                tournament_name = data.get('tournament_name')
                number_of_players = int(data.get('number_of_players'))
                await self.create_tournament(tournament_name, number_of_players)
            elif action == 'join_tournament':
                tournament_id = data.get('tournament_id')
                await self.join_tournament(tournament_id)
            elif action == 'remove_from_waiting_queues':
                await self.remove_from_waiting_queues()

        except Exception as e:
            print(f"Error in receive: {e}. Message: {text_data}")

    async def request_single_game(self):
        print(f"Requesting single game for player {self.player_id}.")
        # Call the matchmaker service to request a single game
        # await matchmaker.request_single_game(self.player_id)

    async def create_tournament(self, tournament_name, number_of_players):
        print(f"Requesting tournament for player {self.player_id}.")
        # await matchmaker.create_tournament(self.player_id, tournament_name, number_of_players)

    async def join_tournament(self, tournament_id):
        print(f"Joining tournament {
              tournament_id} for player {self.player_id}.")
        # await matchmaker.join_tournament(self.player_id, tournament_id)

    async def remove_from_waiting_queues(self):
        print(f"Player {self.player_id} removed from waiting queues.")
        # await matchmaker.remove_from_waiting_queues(self.player_id)

    # This method is invoked when "chat_message" is sent to this consumer
    async def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket client
        await self.send(text_data=json.dumps({
            'message': message
        }))


async def send_message_to_client(client_id, message):
    channel_layer = get_channel_layer()
    channel_name = connected_clients.get(client_id)

    if channel_name:
        try:
            await channel_layer.send(
                channel_name,
                {
                    "type": "chat_message",
                    "message": message,
                }
            )
        except Exception as e:
            print(f"Error sending message to client {client_id}: {e}")
    else:
        print(f"Client {client_id} is not connected")
