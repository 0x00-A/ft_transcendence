from accounts.models.profile import Profile
from .models import Game, Tournament
from .models import Tournament, Game
from asgiref.sync import sync_to_async
from channels.layers import get_channel_layer
from datetime import datetime
import json
from django.db.models import Q
from django.contrib.auth import get_user_model

# from .global_vars import GlobalData

class Matchmaker:

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
        if player_id in cls.games_queue:
            cls.games_queue.remove(player_id)

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
        # Store the game in your database (using Django ORM models)
        User = get_user_model()
        p1 = await User.objects.aget(id=player1_id)
        p2 = await User.objects.aget(id=player2_id)
        game = await Game.objects.acreate(
            player1=p1, player2=p2
        )
        game_address = f"game/game_{game.id}"
        # Simulate game creation with game_id and address
        # game_id = await cls.get_new_game_id()

        # Send the game address to both players
        message = {
            'event': 'game_address',
            'message': 'Game successfully created. Join via:',
            'game_address': game_address,
        }
        await cls.send_message_to_client(player1_id, message)
        await cls.send_message_to_client(player2_id, message)

    @classmethod
    async def create_tournament(cls, creator_id, tournament_name):
        # Create a tournament, check for limits, and notify the creator
        # if await sync_to_async(Tournament.objects.count)() >= 10:
        #     message = {'action': 'error',
        #                'message': 'Maximum tournaments reached'}
        #     await cls.send_message_to_client(creator_id, message)
        #     return

        new_tournament = await Tournament.objects.acreate(
            creator_id=creator_id, name=tournament_name
        )
        await new_tournament.players.aadd(
            cls.connected_clients.get(creator_id).scope['user'])
        await new_tournament.asave()
        # Notify the creator that the tournament has been created
        message = {
            'action': 'tournament_created',
            'message': f'Tournament {new_tournament.name} created',
            'tournament_id': new_tournament.id
        }
        await cls.send_message_to_client(creator_id, message)

    @classmethod
    async def join_tournament(cls, player_id, tournament_id):
        try:
            tournament = await Tournament.objects.aget(id=tournament_id)
            if await sync_to_async(tournament.check_is_full)():
                message = {'action': 'tournament_full',
                           'message': 'Tournament is full'}
                await cls.send_message_to_client(player_id, message)
            else:
                await tournament.players.aadd(player_id)
                message = {'action': 'tournament_joined',
                           'tournament_id': tournament_id}
                await cls.send_message_to_client(player_id, message)
        except Tournament.DoesNotExist:
            await cls.send_message_to_client(player_id, {'error': 'Tournament does not exist'})

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
        if await Game.objects.filter(
            (Q(player1=player_id) | Q(player2=player_id)) & Q(
                status="started")
        ).aexists():
            message = {
                'event': 'already_ingame'
            }
            await cls.send_message_to_client(player_id, message)
            return True
        return False  # Stub implementation

    @classmethod
    async def find_two_players(cls):
        if len(cls.games_queue) >= 2:
            player1 = cls.games_queue.pop(0)
            player2 = cls.games_queue.pop(0)
            return (player1, player2)
        return None

    @classmethod
    async def process_result(cls, game_id, winner, p1_score, p2_score):
        """
        Process the result of a game. Determine if it is a single game or tournament match.
        :param game_id: The ID of the game.
        :param winner_id: The ID of the player who won.
        :param is_tournament: Whether this is a tournament match.
        :param match_id: The specific match ID within the tournament (if applicable).
        """
        if await Game.objects.filter(game_id=game_id).aexists():
            await cls.process_game_result(game_id, winner, p1_score, p2_score)
            # self.games.remove(game)
            return

        # for tournament in self.tournaments:
        #     for match in tournament.matches:
        #         if match['id'] == game_id:
        #             if winner == -1:
        #                 await self.abort_tournament(tournament)
        #                 return
        #             else:
        #                 await self.process_tournament_match_result(tournament, match, winner, p1_wins, p2_wins)
        #                 return

        print(f"Game ID {game_id} not found.")
        return
        # Handle Single Game Results
        if not is_tournament:
            # Retrieve the single game from the database and update its result
            await self.process_single_game(game_id, winner_id)

        # Handle Tournament Match Results
        else:
            # Process the tournament match and advance the tournament state
            await self.process_tournament_match(match_id, winner_id)

    @classmethod
    async def process_game_result(cls, game_id, winner, p1_score, p2_score):
        """Process a single game result and update the database"""
        game = await Game.objects.aget(game_id=game_id)

        await sync_to_async(game.end_game)(winner, p1_score, p2_score)

        # Update the game result and mark it as finished
        # game.winner = winner_id
        # game.state = 'ended'
        # await sync_to_async(game.save)()

        # Notify players that the game has ended
        # await self.notify_players(game_id, game.player1_id, game.player2_id, winner_id)

    # @staticmethod
    # async def process_tournament_match(self, match_id, winner_id):
    #     """Process a tournament match result and advance the tournament"""
    #     match = await sync_to_async(Tournament.objects.get)(id=match_id)

    #     # Update the match result in the tournament
    #     match.winner = winner_id
    #     match.is_over = True
    #     await sync_to_async(match.save)()

    #     # Check if the tournament needs to advance to the next round or end
    #     await self.advance_tournament(match.tournament_id)

    # @staticmethod
    # async def notify_players(self, game_id, player1_id, player2_id, winner_id):
    #     """Send a notification to both players about the game result"""
    #     await self.channel_layer.group_send(
    #         f"game_{game_id}",
    #         {
    #             "type": "game.ended",
    #             "winner": winner_id,
    #             "message": f"Player {winner_id} has won the game!"
    #         }
    #     )

    # @staticmethod
    # async def advance_tournament(self, tournament_id):
    #     """Advance the tournament to the next match or end it if complete"""
    #     tournament = await sync_to_async(Tournament.objects.get)(id=tournament_id)

    #     if tournament.is_complete():
    #         # End the tournament and notify the winner
    #         winner = tournament.determine_winner()
    #         await self.notify_tournament_winner(tournament_id, winner)
    #     else:
    #         # Move to the next match in the tournament
    #         next_match = tournament.get_next_match()
    #         await self.start_tournament_match(next_match)

    # @staticmethod
    # async def start_tournament_match(self, match):
    #     """Start the next tournament match and notify players"""
    #     # Notify players that their match is starting
    #     await self.channel_layer.group_send(
    #         f"tournament_{match.tournament_id}",
    #         {
    #             "type": "match.start",
    #             "match_id": match.id,
    #             "message": f"Match {match.id} is starting!"
    #         }
    #     )

    # @staticmethod
    # async def notify_tournament_winner(self, tournament_id, winner_id):
    #     """Notify all players in the tournament who the winner is"""
    #     await self.channel_layer.group_send(
    #         f"tournament_{tournament_id}",
    #         {
    #             "type": "tournament.ended",
    #             "winner": winner_id,
    #             "message": f"Player {winner_id} has won the tournament!"
    #         }
    #     )
