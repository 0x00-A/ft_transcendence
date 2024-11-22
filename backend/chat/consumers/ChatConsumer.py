import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from ..models import User, Message, Conversation

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        self.other_user_id = self.scope["url_route"]["kwargs"]["user_id"]
        user_id = self.user.id
        other_user_id = int(self.other_user_id)

        print(f"self.user.id type: {type(user_id)}, self.other_user_id type: {type(other_user_id)}")

        self.room_name = f"chat_{min(user_id, other_user_id)}_{max(user_id, other_user_id)}"
        self.room_group_name = f"chat_{self.room_name}"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data["message"]
        sender_id = self.user.id

        print(f"message: {message}, sender_id: {sender_id}")

        await self.save_message(sender_id, self.other_user_id, message)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
                "sender_id": sender_id,
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "message": event["message"],
            "sender_id": event["sender_id"],
        }))

    @sync_to_async
    def save_message(self, sender_id, receiver_id, message):
        sender = User.objects.get(id=sender_id)
        receiver = User.objects.get(id=receiver_id)

        conversation, created = Conversation.objects.get_or_create(
            user1=min(sender, receiver, key=lambda user: user.id),
            user2=max(sender, receiver, key=lambda user: user.id)
        )
        
        Message.objects.create(
            conversation=conversation,
            sender=sender,
            receiver=receiver,
            content=message
        )

        conversation.last_message = message
        conversation.unread_messages += 1
        conversation.save()
