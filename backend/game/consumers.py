from matchmaker.matchmaker import Matchmaker
from matchmaker.models import Game, Match
from asgiref.sync import sync_to_async
import math
import json
import random
import uuid
from django.contrib.auth.models import AnonymousUser


from channels.generic.websocket import AsyncWebsocketConsumer

from channels.layers import get_channel_layer

from asgiref.sync import async_to_sync

import asyncio

channel_layer = get_channel_layer()

canvas_width: int = 650
canvas_height: int = 480
winning_score: int = 3
pW: int = 20
pH: int = 80
ball_raduis: int = 8
initial_ball_speed = 4
initial_ball_angle = (random.random() * math.pi) / 2 - math.pi / 4
paddle_speed = 4

# Global variables
connected_clients = {}
# Managing multiple game instances
games = {}

# Client class for handling clients


class Paddle:
    def __init__(self, x, y, width, height):
        self.x = x
        self.y = y
        self.width = width
        self.height = height
        self.speed = 0  # Paddle speed

    def move(self):
        self.y += self.speed


class Ball:
    def __init__(self, x, y, radius, angle):
        serve_direction = 1 if random.random() < 0.5 else -1
        self.x = x
        self.y = y
        self.radius = radius
        self.angle = angle
        self.dx = serve_direction * \
            initial_ball_speed * math.cos(self.angle)
        self.dy = initial_ball_speed * math.sin(self.angle)
        self.speed = initial_ball_speed

    def move(self):
        self.x += self.dx
        self.y += self.dy

    def bounce(self):
        self.dx = -self.dx  # Reverse x direction on bounce


class GameInstance:
    def __init__(self, game_id):
        self.update_lock = asyncio.Lock()
        self.game_id = game_id
        self.player1_paddle = Paddle(
            x=10, y=canvas_height / 2 - pH / 2, width=pW, height=pH)
        self.player2_paddle = Paddle(
            x=canvas_width - 10 - pW, y=canvas_height / 2 - pH / 2, width=pW, height=pH)
        self.ball = Ball(x=canvas_width / 2, y=canvas_height / 2,
                         radius=ball_raduis, angle=initial_ball_angle)
        self.player1_score = 0
        self.player2_score = 0
        self.is_over = False
        self.winner = 0
        self.paused = False
        self.wall_collision = False
        self.paddle_collision = False
        self.connected_players = 0
        self.player1_user_id = None
        self.player2_user_id = None
        self.winner_id = None

        # self.broadcast_initial_game_state()

    def reset_ball(self):
        self.ball.x = 3 * canvas_width / 4 if self.ball.dx > 0 else canvas_width / 4
        self.ball.y = canvas_height / 2
        self.ball.angle = (random.random() * math.pi) / 2 - math.pi / 4
        self.ball.speed = initial_ball_speed
        serve_sirection = -1 if self.ball.dx > 0 else 1
        self.ball.dx = serve_sirection * initial_ball_speed * \
            math.cos(self.ball.angle)
        self.ball.dy = initial_ball_speed * math.sin(self.ball.angle)

    def update(self):
        # Logic to update the game state
        self.ball.move()

        self.check_collision()
        self.check_for_winner()

    def check_for_winner(self):
        # Logic to determine if a player has won and handle the end of the game
        if self.player1_score >= winning_score:
            self.winner_id = self.player1_user_id
            self.winner = 1
        elif self.player2_score >= winning_score:
            # self.is_over = True
            self.winner_id = self.player2_user_id
            self.winner = 2

    def check_collision(self):
        # Collision detection with paddle
        if self.is_colliding_with_paddle(self.player1_paddle):
            self.handle_paddle_collision(self.player1_paddle)
        elif self.is_colliding_with_paddle(self.player2_paddle):
            self.handle_paddle_collision(self.player2_paddle)

        # Collision detection with top and bottom walls
        if self.ball.y - self.ball.radius <= 0 or self.ball.y + self.ball.radius >= canvas_height:

            self.wall_collision = True
            self.ball.dy = -self.ball.dy  # Reverse vertical direction
            # Correct the ball position to stay within bounds
            if self.ball.y - self.ball.radius <= 0:
                self.ball.y = self.ball.radius
            else:
                self.ball.y = canvas_height - self.ball.radius
        # Collision detection with left and right walls
        if self.ball.x - self.ball.radius <= 0:
            self.player2_score += 1
            self.reset_ball()
        if self.ball.x + self.ball.radius >= canvas_width:
            self.player1_score += 1
            self.reset_ball()

    def do_line_segments_intersect(self, x1, y1, x2, y2, x3, y3, x4, y4):
        denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)

        # Lines are parallel if the denominator is 0
        if denominator == 0:
            return False

        t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator
        u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator

        return 0 <= t <= 1 and 0 <= u <= 1

    def is_colliding_with_paddle(self, paddle):
        # Previous and current position of the ball
        next_x = self.ball.x + self.ball.dx + \
            (self.ball.radius if self.ball.dx > 0 else -self.ball.radius)
        next_y = self.ball.y + self.ball.dy + \
            (self.ball.radius if self.ball.dy > 0 else -self.ball.radius)

        # Paddle edges as line segments
        paddle_left = paddle.x
        paddle_right = paddle.x + paddle.width
        paddle_top = paddle.y
        paddle_bottom = paddle.y + paddle.height

        # Check for intersection with paddle's vertical sides (left and right)
        intersects_left = self.do_line_segments_intersect(
            self.ball.x, self.ball.y, next_x, next_y,
            paddle_left, paddle_top, paddle_left, paddle_bottom
        )

        intersects_right = self.do_line_segments_intersect(
            self.ball.x, self.ball.y, next_x, next_y,
            paddle_right, paddle_top, paddle_right, paddle_bottom
        )

        # Check for intersection with paddle's horizontal sides (top and bottom)
        intersects_top = self.do_line_segments_intersect(
            self.ball.x, self.ball.y, next_x, next_y,
            paddle_left, paddle_top, paddle_right, paddle_top
        )

        intersects_bottom = self.do_line_segments_intersect(
            self.ball.x, self.ball.y, next_x, next_y,
            paddle_left, paddle_bottom, paddle_right, paddle_bottom
        )

        check = intersects_left or intersects_right or intersects_top or intersects_bottom
        if check:
            self.paddle_collision = True
        return check

    def handle_paddle_collision(self, paddle):
        # Check if the ball is hitting the top/bottom or the sides
        ball_from_left = self.ball.x < paddle.x
        ball_from_right = self.ball.x > paddle.x + paddle.width

        ball_from_top = self.ball.y < paddle.y
        ball_from_bottom = self.ball.y > paddle.y + paddle.height

        # Handle side collision
        if ball_from_left or ball_from_right:
            self.ball.dx *= -1  # Reverse the horizontal velocity
            if ball_from_left:
                self.ball.x = paddle.x - self.ball.radius
            elif ball_from_right:
                self.ball.x = paddle.x + paddle.width + self.ball.radius

            relative_impact = (
                self.ball.y - (paddle.y + paddle.height / 2)) / (paddle.height / 2)
            max_bounce_angle = math.pi / 4  # 45 degrees maximum bounce angle

            # Calculate new angle based on relative impact
            new_angle = relative_impact * max_bounce_angle

            # Update ball's velocity (dx, dy) based on the new angle
            direction = 1 if self.ball.dx > 0 else -1
            self.ball.speed += 0.1
            self.ball.dx = direction * self.ball.speed * \
                math.cos(new_angle)  # Horizontal velocity
            self.ball.dy = self.ball.speed * \
                math.sin(new_angle)  # Vertical velocity

        # Handle top/bottom collision
        if ball_from_top or ball_from_bottom:
            self.ball.dy *= -1
            if ball_from_top:
                self.ball.y = paddle.y - self.ball.radius
            elif ball_from_bottom:
                self.ball.y = paddle.y + paddle.height + self.ball.radius


def create_game(game_id):
    games[game_id] = GameInstance(game_id)


def get_game(game_id):
    # game_instance = get_game("game_id")
    # if not game_instance:
    #     pass
    return games.get(game_id)


def remove_game(game_id):
    if game_id in games:
        del games[game_id]


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = "chat_%s" % self.room_name

        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name, {"type": "chat_message", "message": message}
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event["message"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"message": message}))


class GameConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        user = self.scope['user']
        self.game_id = None

        if user and not isinstance(user, AnonymousUser):
            await self.accept()
            self.game_id = self.scope['url_route']['kwargs']['game_id']
            await self.channel_layer.group_add(self.game_id, self.channel_name)

            if not get_game(self.game_id):
                create_game(self.game_id)
                get_game(self.game_id).connected_players += 1
                get_game(self.game_id).player1_user_id = user.id
                # if await Game.objects.filter(game_id=self.game_id).aexists():
                #     if user.games_as_player1.filter(game_id=self.game_id).exists():
                #         self.player_id = 'player1'
                #     else:
                #         self.player_id = 'player2'
                # elif await Match.objects.filter(match_id=self.game_id).aexists():
                #     if user.matches_as_player1.filter(match_id=self.game_id).exists():
                #         self.player_id = 'player1'
                #     else:
                #         self.player_id = 'player2'
                await self.set_player_id_name()
            else:
                get_game(self.game_id).connected_players += 1
                get_game(self.game_id).player2_user_id = user.id
                # self.player_id = 'player2'
                await self.set_player_id_name()
                await self.channel_layer.group_send(
                    self.game_id,
                    {
                        "type": "game.init",  # This matches the method name
                        # "room_id": game_room_id,
                        # "message": 'game_started'
                    }
                )
                # Start the game loop
                asyncio.create_task(self.start_game(self.game_id))
        else:
            await self.close()

    async def set_player_id_name(self):
        user = self.scope['user']
        if await Game.objects.filter(game_id=self.game_id).aexists():
            if await user.games_as_player1.filter(game_id=self.game_id).aexists():
                self.player_id = 'player1'
            else:
                self.player_id = 'player2'
        elif await Match.objects.filter(match_id=self.game_id).aexists():
            if await user.matches_as_player1.filter(match_id=self.game_id).aexists():
                self.player_id = 'player1'
            else:
                self.player_id = 'player2'

    async def receive(self, text_data):
        data = json.loads(text_data)
        game: GameInstance = get_game(self.game_id)

        if data['type'] == 'keydown':
            await self.handle_keydown(data['direction'])
        if data['type'] == 'pause':
            game.paused = True
            await self.channel_layer.group_send(
                game.game_id,
                {
                    "type": "pause.resume",
                    "action": "pause",
                }
            )
        elif data['type'] == 'resume':
            game.paused = False
            await self.channel_layer.group_send(
                game.game_id,
                {
                    "type": "pause.resume",
                    "action": "resume",
                }
            )

    async def handle_keydown(self, direction):
        game: GameInstance = get_game(self.game_id)
        if self.player_id == 'player1':
            if direction == 'up':
                new_position = max(0, game.player1_paddle.y - paddle_speed)
            elif direction == 'down':
                new_position = min(canvas_height - pH,
                                   game.player1_paddle.y + paddle_speed)
            game.player1_paddle.y = new_position
        else:
            if direction == 'up':
                new_position = max(0, game.player2_paddle.y - paddle_speed)
            elif direction == 'down':
                new_position = min(canvas_height - pH,
                                   game.player2_paddle.y + paddle_speed)
            game.player2_paddle.y = new_position

    async def disconnect(self, close_code):
        game_id = self.game_id
        print(
            f"------------ player {self.scope['user'].username} disconnected ------------")
        if game_id:
            game: GameInstance = get_game(game_id)
            await self.channel_layer.group_discard(f"game_{self.game_id}", self.channel_name)
            await self.channel_layer.group_send(
                self.game_id,
                {
                    'type': 'player.disconnected',
                    'message': 'Your opponent has disconnected.'
                }
            )
            if game.connected_players <= 1:
                await self.abort_game()
            else:
                game.connected_players -= 1

    async def abort_game(self):
        # Synchronously retrieve the Game object and update its state
        game_instance: GameInstance = get_game(self.game_id)
        # game_instance.is_over = True
        game_instance.winner = -1
        self.winner_id = -1

        # game = await sync_to_async(Game.objects.get)(game_id=self.game_id)
        # await sync_to_async(game.abort_game)()

    async def start_game(self, game_id):
        game_instance: GameInstance = games[game_id]

        # Game loop
        while not game_instance.is_over:
            if not game_instance.paused:
                game_instance.update()

                if game_instance.wall_collision:
                    await self.channel_layer.group_send(
                        game_instance.game_id,
                        {
                            "type": "play_sound",
                            "collision": "wall"
                        }
                    )
                    game_instance.wall_collision = False
                if game_instance.paddle_collision:
                    await self.channel_layer.group_send(
                        game_instance.game_id,
                        {
                            "type": "play_sound",
                            "collision": "paddle"
                        }
                    )
                    game_instance.paddle_collision = False

                # Broadcast updated game state to players
                if game_instance.winner:
                    await self.broadcast_winner_state(game_id)
                else:
                    await self.broadcast_game_state(game_id)

            await asyncio.sleep(1 / 60)  # Run at 60 FPS

    async def broadcast_game_state(self, game_id):
        game: GameInstance = games[game_id]

        game_state = {
            'player1_paddle_x': game.player1_paddle.x,
            'player1_paddle_y': game.player1_paddle.y,
            'player1_score': game.player1_score,

            'player2_paddle_x': game.player2_paddle.x,
            'player2_paddle_y': game.player2_paddle.y,
            'player2_score': game.player2_score,
            'ball': {
                'x': game.ball.x,
                'y': game.ball.y,
            },
        }
        mirror_state = {
            'player1_paddle_x': canvas_width - game.player2_paddle.x - game.player2_paddle.width,
            'player1_paddle_y': game.player2_paddle.y,
            'player1_score': game.player2_score,

            'player2_paddle_x': canvas_width - game.player1_paddle.x - game.player1_paddle.width,
            'player2_paddle_y': game.player1_paddle.y,
            'player2_score': game.player1_score,
            'ball': {
                'x': canvas_width - game.ball.x,
                'y': game.ball.y,
            },
        }
        await self.channel_layer.group_send(
            game.game_id,
            {
                'type': 'game.state.update',
                'state1': game_state,
                'state2': mirror_state,
            }
        )

    async def broadcast_winner_state(self, game_id):
        game: GameInstance = games[game_id]

        game_state = {
            "is_winner": True if game.winner == 1 else False
        }
        mirror_state = {
            "is_winner": True if game.winner == 2 else False
        }
        game.is_over = True
        await self.channel_layer.group_send(
            game.game_id,
            {
                'type': 'game.over',
                'state1': game_state,
                'state2': mirror_state,
            }
        )
        if game.winner == -1:
            remove_game(game_id)
            await Matchmaker.process_result(game_id, -1)
        else:
            await Matchmaker.process_result(game_id, game.winner, game.player1_score, game.player2_score)

    async def game_state_update(self, event):
        state = event["state1"] if self.player_id == 'player1' else event["state2"]
        await self.send(text_data=json.dumps(
            {
                'type': 'game_update',
                'state': state,
            }
        ))

    async def game_over(self, event):
        state = event["state1"] if self.player_id == 'player1' else event["state2"]
        await self.send(text_data=json.dumps(
            {
                'type': 'game_over',
                'state': state,
            }
        ))

    async def play_sound(self, event):
        await self.send(text_data=json.dumps({
            'type': event['type'],
            'collision': event['collision']
        }))

    async def game_init(self, event):
        # message = event["message"]
        game_id = self.game_id
        game: GameInstance = get_game(game_id)

        await self.send(text_data=json.dumps(
            {
                "type": 'game_started',
            }
        ))

    async def player_disconnected(self, event):
        message = event["type"]
        await self.send(text_data=json.dumps(
            {
                "type": 'player_disconnected',
            }
        ))

    async def pause_resume(self, event):
        await self.send(text_data=json.dumps(
            {
                "type": event['action'],
            }
        ))
