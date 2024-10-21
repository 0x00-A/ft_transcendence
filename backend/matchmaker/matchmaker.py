from .models import Tournament, Game
from asgiref.sync import sync_to_async
from channels.layers import get_channel_layer
from datetime import datetime
import json
from django.db.models import Q

from .global_vars import GlobalData


class MatchMaker:

    connected_clients = {}
    tournaments = []
    games = []
    games_queue = []

    @classmethod
    async def register_client(cls, player_id, consumer):
        cls.connected_clients[player_id] = consumer

    @classmethod
    async def unregister_client(cls, player_id):
        if player_id in cls.connected_clients:
            del cls.connected_clients[player_id]

    @classmethod
    async def request_remote_game(cls, player_id):
        # Handle remote game matchmaking here
        if await cls.is_client_already_playing(player_id):
            return
        # Add player to the queue, etc.
        # After finding a match:
        cls.games_queue.append(player_id)
        message = {
            'event': 'in_queue'
        }
        await cls.send_message_to_client(player_id, message)
        players = await cls.find_two_players()
        if players:
            await cls.create_remote_game(*players)

    @classmethod
    async def create_remote_game(cls, player1_id, player2_id):
        print(f"creating game... p1: {player1_id} | p2: {player2_id}")
        # Simulate game creation with game_id and address
        game_id = await cls.get_new_game_id()
        game_address = f"ws://localhost/{game_id}"

        # Send the game address to both players
        message = {
            'event': 'game_address',
            'message': 'Game successfully created. Join via:',
            'game_address': game_address,
        }
        await cls.send_message_to_client(player1_id, message)
        await cls.send_message_to_client(player2_id, message)

        # Store the game in your database (using Django ORM models)
        await sync_to_async(Game.objects.create)(
            player1_id=player1_id, player2_id=player2_id, game_address=game_address
        )

    # @classmethod
    # async def create_tournament(cls, creator_id, tournament_name, number_of_players):
    #     # Create a tournament, check for limits, and notify the creator
    #     # Assuming 10 is the max number of tournaments
    #     if await sync_to_async(Tournament.objects.count)() >= 10:
    #         message = {'action': 'error',
    #                    'message': 'Maximum tournaments reached'}
    #         await cls.send_message_to_client(creator_id, message)
    #         return

    #     new_tournament = await sync_to_async(Tournament.objects.create)(
    #         creator_id=creator_id, name=tournament_name, number_of_players=number_of_players
    #     )
    #     # Notify the creator that the tournament has been created
    #     message = {
    #         'action': 'tournament_created',
    #         'message': f'Tournament {new_tournament.name} created',
    #         'tournament_id': new_tournament.id
    #     }
    #     await cls.send_message_to_client(creator_id, message)

    # @classmethod
    # async def join_tournament(cls, player_id, tournament_id):
    #     # Logic for joining a tournament
    #     tournament = await sync_to_async(Tournament.objects.get)(id=tournament_id)
    #     if tournament.is_full():
    #         message = {'action': 'tournament_full',
    #                    'message': 'Tournament is full'}
    #         await cls.send_message_to_client(player_id, message)
    #     else:
    #         await sync_to_async(tournament.add_player)(player_id)
    #         message = {'action': 'tournament_joined',
    #                    'tournament_id': tournament_id}
    #         await cls.send_message_to_client(player_id, message)

    @classmethod
    async def send_message_to_client(cls, player_id, message):
        consumer = cls.connected_clients.get(player_id)
        if consumer:
            await consumer.send_message(message)

    @classmethod
    async def is_client_already_playing(cls, player_id):
        # Check if the player is already in a game or tournament
        if player_id in cls.games_queue:
            message = {
                'event': 'already_inqueue'
            }
            await cls.send_message_to_client(player_id, message)
            return True
        if await sync_to_async(
            Game.objects.filter(
                (Q(player1_id=player_id) | Q(player2_id=player_id)) & Q(
                    status="ongoing")
            ).exists
        )():
            message = {
                'event': 'already_ingame'
            }
            await cls.send_message_to_client(player_id, message)
            return True
        return False  # Stub implementation

    @classmethod
    async def get_new_game_id(cls):

        return GlobalData.increment_game_id_counter()

    @classmethod
    async def find_two_players(cls):
        if len(cls.games_queue) >= 2:
            player1 = cls.games_queue.pop(0)
            player2 = cls.games_queue.pop(0)
            return (player1, player2)
        return None
