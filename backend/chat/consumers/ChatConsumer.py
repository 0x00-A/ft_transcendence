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

        self.room_name = f"chat_{min(user_id, other_user_id)}_{max(user_id, other_user_id)}"
        self.room_group_name = f"chat_{self.room_name}"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get("action")

        print(f"Action: {action}, Data: {data}")
        if action == "send_message":
            await self.handle_send_message(data)
        elif action == "typing":
            await self.handle_typing_status(data)

    async def handle_send_message(self, data):
        message = data.get("message")
        sender_id = self.user.id
        receiver_id = int(self.other_user_id)

        conversation = await self.save_message(sender_id, receiver_id, message)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
                "sender_id": sender_id,
                "conversation_id": conversation.id,
            }
        )

    async def handle_typing_status(self, data):
        typing = data.get("typing", False)
        sender_id = self.user.id

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "typing_status",
                "typing": typing,
                "sender_id": sender_id,
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "type": "chat_message",
            "message": event["message"],
            "sender_id": event["sender_id"],
            "conversation_id": event["conversation_id"],
        }))

    async def typing_status(self, event):
        await self.send(text_data=json.dumps({
            "type": "typing_status",
            "typing": event["typing"],
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
        if not created:  
            conversation.unread_messages += 1  
        conversation.save()

        return conversation

    @sync_to_async
    def mark_messages_as_seen(self, sender_id, receiver_id):
        conversation = Conversation.objects.get(
            user1=min(sender_id, receiver_id, key=lambda user: user.id),
            user2=max(sender_id, receiver_id, key=lambda user: user.id)
        )

        unread_messages = conversation.messages.filter(
            receiver_id=sender_id,
            seen=False
        )
        unread_messages.update(seen=True)

        conversation.unread_messages = 0
        conversation.save()
