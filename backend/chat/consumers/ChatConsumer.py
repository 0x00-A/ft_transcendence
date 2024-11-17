import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from ..models import User, Message, Conversation

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Get the current user and the other user's ID from the URL
        self.user = self.scope["user"]
        self.other_user_id = self.scope["url_route"]["kwargs"]["user_id"]

        # Create a unique room name to ensure the chat is private
        self.room_name = f"chat_{min(self.user.id, self.other_user_id)}_{max(self.user.id, self.other_user_id)}"
        self.room_group_name = f"chat_{self.room_name}"

        # Join the room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Leave the room group when the WebSocket disconnects
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        # Receive a message from WebSocket
        data = json.loads(text_data)
        message = data["message"]
        sender_id = self.user.id  # The current user is the sender

        # Save the message to the database
        await self.save_message(sender_id, self.other_user_id, message)

        # Broadcast the message to everyone in the room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
                "sender_id": sender_id,
            }
        )

    async def chat_message(self, event):
        # Send the message to WebSocket
        await self.send(text_data=json.dumps({
            "message": event["message"],
            "sender_id": event["sender_id"],
        }))

    @sync_to_async
    def save_message(self, sender_id, receiver_id, message):
        # Find or create the conversation between the users
        sender = User.objects.get(id=sender_id)
        receiver = User.objects.get(id=receiver_id)

        conversation, created = Conversation.objects.get_or_create(
            user1=min(sender, receiver, key=lambda user: user.id),
            user2=max(sender, receiver, key=lambda user: user.id)
        )
        
        # Save the message in the conversation
        Message.objects.create(
            conversation=conversation,
            sender=sender,
            receiver=receiver,
            content=message
        )

        # Update conversation's last_message and unread_messages count
        conversation.last_message = message
        conversation.unread_messages += 1
        conversation.save()
