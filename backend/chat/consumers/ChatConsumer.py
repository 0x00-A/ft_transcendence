import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from ..models import User, Message, Conversation

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        if self.user.is_authenticated:
            self.user_group_name = f"user_{self.user.id}"
            
            await self.channel_layer.group_add(self.user_group_name, self.channel_name)
            await self.accept()
        else:
            await self.close()

    async def disconnect(self, close_code):
        if self.user.is_authenticated:
            await self.channel_layer.group_discard(self.user_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get("action")

        print(f"Action: {action}, Data: {data}")
        if action == "send_message":
            await self.handle_send_message(data)
        elif action == "typing":
            await self.handle_typing_status(data)
        elif action == "mark_as_read":
            await self.handle_mark_as_read(data)

    async def handle_send_message(self, data):
        message = data.get("message")
        receiver_id = data.get("receiver_id") 
        sender_id = self.user.id

        if not receiver_id or not message:
            return  

        conversation = await self.save_message(sender_id, receiver_id, message)

        await self.channel_layer.group_send(
            f"user_{sender_id}",
            {
                "type": "chat_message",
                "message": message,
                "sender_id": sender_id,
                "receiver_id": receiver_id,
                "conversation_id": conversation.id,
            }
        )
        await self.channel_layer.group_send(
            f"user_{receiver_id}",
            {
                "type": "chat_message",
                "message": message,
                "sender_id": sender_id,
                "receiver_id": receiver_id,
                "conversation_id": conversation.id,
            }
        )

    async def handle_typing_status(self, data):
        typing = data.get("typing", False)
        receiver_id = data.get("receiver_id")
        sender_id = self.user.id

        if not receiver_id:
            return 

        await self.channel_layer.group_send(
            f"user_{receiver_id}",
            {
                "type": "typing_status",
                "typing": typing,
                "sender_id": sender_id,
            }
        )
    async def handle_mark_as_read(self, data):
        receiver_id = data.get("receiver_id")
        conversation_id = data.get("conversation_id")

        if receiver_id == self.user.id:
            await self.mark_conversation_as_read(conversation_id)

        await self.send(text_data=json.dumps({
            "type": "mark_as_read",
            "status": "success",
            "conversation_id": conversation_id
        }))

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "type": "chat_message",
            "message": event["message"],
            "sender_id": event["sender_id"],
            "receiver_id": event["receiver_id"],
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
        if sender_id != receiver_id:
            conversation.unread_messages += 1
        conversation.save()

        return conversation
    @sync_to_async
    def mark_conversation_as_read(self, conversation_id):
        conversation = Conversation.objects.get(id=conversation_id)

        conversation.unread_messages = 0
        conversation.save()

