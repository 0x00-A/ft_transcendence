import math
import json
import random
import uuid

from channels.generic.websocket import AsyncWebsocketConsumer

from channels.layers import get_channel_layer

from asgiref.sync import async_to_sync

import asyncio

channel_layer = get_channel_layer()

canvas_width: int = 650
canvas_height: int = 480
winning_score: int = 5
pW: int = 20
pH: int = 80
ball_raduis: int = 8
initial_ball_speed = 4
initial_ball_angle = (random.random() * math.pi) / 2 - math.pi / 4
paddle_speed = 4


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
    def __init__(self, room_id):
        self.update_lock = asyncio.Lock()
        self.room_id = room_id
        self.player1_paddle = Paddle(
            x=10, y=canvas_height / 2 - pH / 2, width=pW, height=pH)
        self.player2_paddle = Paddle(
            x=canvas_width - 10 - pW, y=canvas_height / 2 - pH / 2, width=pW, height=pH)
        self.ball = Ball(x=canvas_width / 2, y=canvas_height / 2,
                         radius=ball_raduis, angle=initial_ball_angle)
        self.player1_score = 0
        self.player2_score = 0
        self.is_over = False
        self.winner = ''
        self.paused = False
        self.wall_collision = False
        self.paddle_collision = False

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

    def check_for_winner(self):
        # Logic to determine if a player has won and handle the end of the game
        if self.player1_score >= 10:
            return "Player 1 wins!"
        elif self.player2_score >= 10:
            return "Player 2 wins!"
        return None

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


# Managing multiple game instances
games = {}


def create_game(room_id):
    games[room_id] = GameInstance(room_id)


def get_game(room_id):
    # game_instance = get_game("room_id")
    # if not game_instance:
    #     pass
    return games.get(room_id)


def remove_game(room_id):
    if room_id in games:
        del games[room_id]


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
    waiting_players = set()

    async def connect(self):
        await self.accept()

        # self.player_id = str(uuid.uuid4())
        # await self.send(text_data=json.dumps({
        #     'type': 'connection',
        #     'player_id': self.player_id,
        # }))
        # GameConsumer.waiting_players.add(self.channel_name)
        await self.find_match()

    async def receive(self, text_data):
        data = json.loads(text_data)
        game: GameInstance = get_game(self.scope.get('game_room'))

        if data['type'] == 'keydown':
            await self.handle_keydown(data['direction'])
        if data['type'] == 'pause':
            game.paused = True
            await self.channel_layer.group_send(
                game.room_id,
                {
                    "type": "pause.resume",
                    "action": "pause",
                }
            )
        elif data['type'] == 'resume':
            game.paused = False
            await self.channel_layer.group_send(
                game.room_id,
                {
                    "type": "pause.resume",
                    "action": "resume",
                }
            )

    async def handle_keydown(self, direction):
        game: GameInstance = get_game(self.scope.get('game_room'))
        # paddle_position = game.player1_paddle.y if self.player_id == 'player1' else game.player2_paddle.y
        if self.player_id == 'player1':
            # Update paddle position based on the direction
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

        # # Broadcast new paddle position to both clients
        # await self.channel_layer.group_send(
        #     self.room_name,
        #     {
        #         "type": "paddle_update",
        #         "position": new_position,
        #     }
        # )

    async def disconnect(self, close_code):
        # Remove player from the waiting room
        game_room_id = self.scope.get('game_room')
        GameConsumer.waiting_players.discard(game_room_id)
        # Get the game room the player is in from the scope

        if game_room_id:
            # Remove the player from the game room group
            await self.channel_layer.group_discard(game_room_id, self.channel_name)

            # Optionally notify the other player that their opponent disconnected
            await self.channel_layer.group_send(
                game_room_id,
                {
                    'type': 'player.disconnected',
                    'message': 'Your opponent has disconnected.'
                }
            )
        # remove_game(game_room_id)

    async def find_match(self):
        # Lock the critical section to avoid race conditions
        if not len(GameConsumer.waiting_players):
            # If no one is waiting, assign player1 and add to waiting list
            self.player_id = 'player1'
            game_room_id = 'game_' + str(uuid.uuid4())
            self.scope['game_room'] = game_room_id
            await self.channel_layer.group_add(game_room_id, self.channel_name)

            GameConsumer.waiting_players.add(game_room_id)

            await self.send(text_data=json.dumps({
                'type': 'connection',
                'player_id': self.player_id,
                'game_room_id': game_room_id,
            }))
            # await self.send(text_data=json.dumps({
            #     'type': 'connection',
            #     'player_id': self.player_id,
            # }))
        else:
            self.player_id = 'player2'
            game_room_id = GameConsumer.waiting_players.pop()
            await self.channel_layer.group_add(game_room_id, self.channel_name)
            self.scope['game_room'] = game_room_id

            # other_player_channel.scope['game_room'] = game_room_id
            create_game(game_room_id)

            # Add both players to the same game room
            # await self.channel_layer.group_add(game_room_id, other_player_channel)

            # Send information to both players
            await self.send(text_data=json.dumps({
                'type': 'connection',
                'player_id': self.player_id,
                'game_room_id': game_room_id,
            }))
            await self.channel_layer.group_send(
                game_room_id,
                {
                    "type": "game.init",  # This matches the method name
                    # "room_id": game_room_id,
                    # "message": 'game_started'
                }
            )
            # Start the game loop
            asyncio.create_task(self.start_game(game_room_id))

    async def start_game(self, room_id):
        game_instance: GameInstance = games[room_id]

        # Game loop
        while True:
            if not game_instance.paused:
                game_instance.update()

                if game_instance.wall_collision:
                    await self.channel_layer.group_send(
                        game_instance.room_id,
                        {
                            "type": "collision_event",
                            "collision": "wall"
                        }
                    )
                    game_instance.wall_collision = False
                if game_instance.paddle_collision:
                    await self.channel_layer.group_send(
                        game_instance.room_id,
                        {
                            "type": "collision_event",
                            "collision": "paddle"
                        }
                    )
                    game_instance.paddle_collision = False

                # Broadcast updated game state to players
                await self.broadcast_game_state(room_id)

            await asyncio.sleep(1 / 60)  # Run at 60 FPS

    async def broadcast_game_state(self, room_id):
        game: GameInstance = games[room_id]

        # Here you would send the game state to all players in the room
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
            # 'game_over': game.is_over,
            # 'winner': game.winner,
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
            # 'game_over': game.is_over,
            # 'winner': game.winner,
        }
        await self.channel_layer.group_send(
            game.room_id,
            {
                'type': 'game.state.update',
                'state1': game_state,
                'state2': mirror_state,
            }
        )
    # async def find_match(self):
    #     # Check if there are at least two players waiting
    #     if len(GameConsumer.waiting_players) >= 2:
    #         # Create a new game room ID
    #         game_room_id = 'game_' + str(uuid.uuid4())
    #         self.scope['game_room'] = game_room_id

    #         create_game(game_room_id)

    #         # Create a list of members to match
    #         members = list(GameConsumer.waiting_players)[:2]

    #         # Add the members to the game room
    #         for member in members:
    #             await self.channel_layer.group_add(game_room_id, member)

    #         # Send a message to all members that they are matched
    #         await self.channel_layer.group_send(
    #             game_room_id,
    #             {
    #                 "type": "game.message",  # This matches the method name
    #                 "room_id": game_room_id,
    #                 "message": 'game_started'
    #             }
    #         )

    #         # Remove all players from the waiting room
    #         for member in members:
    #             GameConsumer.waiting_players.discard(member)

    async def game_state_update(self, event):
        state = event["state1"] if self.player_id == 'player1' else event["state2"]
        await self.send(text_data=json.dumps(
            {
                'type': 'game_update',
                'state': state,
            }
        ))

    async def collision_event(self, event):
        await self.send(text_data=json.dumps({
            'type': event['type'],
            'collision': event['collision']
        }))

    async def game_init(self, event):
        # message = event["message"]
        room_id = self.scope.get('game_room')
        game: GameInstance = get_game(room_id)

        await self.send(text_data=json.dumps(
            {
                "type": 'game_started',
                # "game_room_id": room_id,
                # 'player_id': self.player_id,
                # "players": {
                #     "player1": {
                #         'paddle': {
                #             'x': game.player1_paddle.x,
                #             'y': game.player1_paddle.y,
                #             'w': game.player1_paddle.width,
                #             'h': game.player1_paddle.height
                #         },
                #         'score': game.player1_score,
                #         'is_winner': False,
                #     },
                #     "player2": {
                #         'paddle': {
                #             'x': game.player2_paddle.x,
                #             'y': game.player2_paddle.y,
                #             'w': game.player2_paddle.width,
                #             'h': game.player2_paddle.height
                #         },
                #         'score': game.player2_score,
                #         'is_winner': False,
                #     }
                # },
                # 'ball': {
                #     'x': game.ball.x,
                #     'y': game.ball.y,
                #     'radius': game.ball.radius,
                #     # 'color': game.ball.color
                # }
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

    # async def connect(self):
    #     # Check if waiting room exists
    #     if not self.channel_layer.exists('waiting_room'):
    #         # First player connects
    #         await self.channel_layer.group_add('waiting_room', self.channel_name)
    #         self.is_waiting = True
    #     else:
    #         # Create a unique game room ID
    #         game_room_id = 'game_' + str(uuid.uuid4())

    #         # Move both players to the game room
    #         await self.channel_layer.group_add(game_room_id, self.channel_name)

    #         # Retrieve members of waiting_room
    #         members = await self.channel_layer.group_channels('waiting_room')
    #         await self.channel_layer.group_add(game_room_id, members[0])
    #         await self.channel_layer.group_discard('waiting_room', members[0])

    #         await self.channel_layer.group_send(
    #             game_room_id,
    #             {
    #                 "type": "chat_message",  # This matches the method name
    #                 "room_id": game_room_id,
    #                 "message": 'game_started'
    #             }
    #         )
