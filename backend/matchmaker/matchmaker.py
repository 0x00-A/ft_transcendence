from accounts.models.profile import Profile
from .models import Game, Tournament, Match
from asgiref.sync import sync_to_async
from channels.layers import get_channel_layer
from datetime import datetime
from django.utils import timezone

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
        await cls.check_is_player_in_any_tournament(player_id)

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
            'message': 'Game successfully created',
            'game_address': game_address,
        }
        await cls.send_message_to_client(player1_id, message)
        await cls.send_message_to_client(player2_id, message)

    @classmethod
    async def create_tournament(cls, creator_id, tournament_name):
        # Create a tournament, check for limits, and notify the creator
        # if await sync_to_async(Tournament.objects.count)() >= 10:
        #     message = {'event': 'error',
        #                'message': 'Maximum tournaments reached'}
        #     await cls.send_message_to_client(creator_id, message)
        #     return
        if await Tournament.objects.filter(players__id=creator_id).exclude(status='ended').aexists():
            message = {'event': 'error',
                       'message': 'You can\'t create a new tournament until your current tournament ends.'}
            await cls.send_message_to_client(creator_id, message)
            return

        new_tournament = await Tournament.objects.acreate(
            creator_id=creator_id, name=tournament_name
        )
        await new_tournament.players.aadd(
            cls.connected_clients.get(creator_id).scope['user'])
        await new_tournament.asave()
        # Notify the creator that the tournament has been created
        message = {
            'event': 'tournament_created',
            'message': f'Tournament {new_tournament.name} created',
            'tournament_id': new_tournament.id,
            'tournament_stat': await sync_to_async(new_tournament.to_presentation)(),
        }
        await cls.send_message_to_client(creator_id, message)

    @classmethod
    async def join_tournament(cls, player_id, tournament_id):
        if await Tournament.objects.filter(players__id=player_id).exclude(status='ended').aexists():
            message = {'event': 'error',
                       'message': 'Cannot join more tournaments'}
            await cls.send_message_to_client(player_id, message)
            return
        try:
            tournament = await Tournament.objects.aget(id=tournament_id)
            if await sync_to_async(tournament.check_if_full)():
                message = {'event': 'tournament_full',
                           'message': 'Tournament is full'}
                await cls.send_message_to_client(player_id, message)
            else:
                await tournament.players.aadd(player_id)
                message = {'event': 'tournament_joined',
                           'message': f'Joined tournament {tournament.name} successfully',
                           'tournament_id': tournament_id,
                           'tournament_stat': await sync_to_async(tournament.to_presentation)(),
                           }
                await cls.send_message_to_client(player_id, message)
                await sync_to_async(tournament.check_if_full)()
                if await sync_to_async(tournament.start_tournament)():
                    message = {'event': 'tournament_update',
                               'tournament_id': tournament_id,
                               'tournament_stat': await sync_to_async(tournament.to_presentation)(),
                               }
                    players = await sync_to_async(list)(tournament.players.all())
                    for p in players:
                        await cls.send_message_to_client(p.id, message)

        except Tournament.DoesNotExist:
            await cls.send_message_to_client(player_id, {'error': 'Tournament does not exist'})

    @classmethod
    async def send_message_to_client(cls, player_id, message):
        consumer = cls.connected_clients.get(player_id)
        if consumer:
            await consumer.send_message(message)

    @classmethod
    async def is_client_already_playing(cls, player_id):
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
    async def check_is_player_in_any_tournament(cls, player_id):
        if await Tournament.objects.filter(players__id=player_id).exclude(status='ended').aexists():
            tournament = await sync_to_async(Tournament.objects.exclude(status='ended').get)(
                players__id=player_id
            )
            message = {
                'event': 'already_in_tournament',
                'tournament_id': tournament.id,
                'tournament_stat': await sync_to_async(tournament.to_presentation)(),
            }
            await cls.send_message_to_client(player_id, message)

            try:
                match = await sync_to_async(Match.objects.get)(
                    (Q(player1_id=player_id) | Q(
                        player2_id=player_id)) & ~Q(status='ended')
                )
                if match.player1_id == player_id and match.player2_ready:
                    # match.player1_ready = False
                    message = {
                        'event': 'opponent_ready',
                        "message": "Your oponent is ready!",
                    }
                    await cls.send_message_to_client(match.player1_id, message)
                elif match.player2_id == player_id and match.player1_ready:
                    match.player2_ready = False
                    message = {
                        'event': 'opponent_ready',
                        "message": "Your oponent is ready!",
                    }
                    await cls.send_message_to_client(match.player2_id, message)

                await sync_to_async(match.save)()
            except Match.DoesNotExist:
                return None

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
        if await Match.objects.filter(match_id=game_id).aexists():
            await cls.process_tournament_match(game_id, winner, p1_score, p2_score)
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
        await sync_to_async(game.update_stats)()

    @classmethod
    async def process_tournament_match(cls, match_id, winner, p1_score, p2_score):
        """Process a tournament match result and advance the tournament"""
        match = await Match.objects.aget(match_id=match_id)

        await sync_to_async(match.end_match)(winner, p1_score, p2_score)

        tournament = await sync_to_async(lambda: match.tournament)()
        if not await tournament.matches.filter(status='waiting').aexists():
            completed_count = await sync_to_async(tournament.matches.filter(status='ended').count)()
            if completed_count == tournament.number_of_players // 2:
                await sync_to_async(tournament.progress_to_next_round)()
            elif completed_count == tournament.number_of_players - 1:
                await sync_to_async(tournament.finalize_tournament)()

        message = {'event': 'tournament_update',
                   'tournament_id': match.tournament.id,
                   'tournament_stat': await sync_to_async(tournament.to_presentation)(),
                   }
        players = await sync_to_async(list)(tournament.players.all())
        for player in players:
            await cls.send_message_to_client(player.id, message)

    @classmethod
    async def handle_player_unready(cls, player_id):

        try:
            match = await sync_to_async(Match.objects.get)(
                (Q(player1_id=player_id) | Q(
                    player2_id=player_id)) & ~Q(status='ended')
            )
            if match.player1_id == player_id:
                match.player1_ready = False
                message = {
                    'event': 'opponent_unready',
                    "message": "Your oponent is not ready!",
                }
                await cls.send_message_to_client(match.player2_id, message)
            elif match.player2_id == player_id:
                match.player2_ready = False
                message = {
                    'event': 'opponent_unready',
                    "message": "Your oponent is not ready!",
                }
                await cls.send_message_to_client(match.player1_id, message)

            await sync_to_async(match.save)()
        except Match.DoesNotExist:
            return None

    @classmethod
    async def handle_player_ready(cls, player_id, match_id):
        match = await sync_to_async(Match.objects.get)(match_id=match_id)

        if match.player1_id == player_id:
            match.player1_ready = True
            message = {
                'event': 'opponent_ready',
                "message": "Your oponent is ready!",
            }
            await cls.send_message_to_client(match.player2_id, message)
        elif match.player2_id == player_id:
            match.player2_ready = True
            message = {
                'event': 'opponent_ready',
                "message": "Your oponent is ready!",
            }
            await cls.send_message_to_client(match.player1_id, message)

        await sync_to_async(match.save)()

        if match.ready():
            match.status = 'started'
            match.start_time = timezone.now()
            await sync_to_async(match.save)()
            match_address = f"game/match_{match.id}"

            message = {
                'event': 'match_start',
                'match_address': match_address,
                "message": "Match started!",
            }
            await cls.send_message_to_client(match.player1_id, message)
            await cls.send_message_to_client(match.player2_id, message)

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
