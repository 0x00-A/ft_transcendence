import json
from channels.generic.websocket import AsyncWebsocketConsumer
from ..models import User, Message, Conversation
from asgiref.sync import sync_to_async
from django.db.models import Q


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
            # await self.set_active_conversation(self.user.id, -1)
            await self.channel_layer.group_discard(self.user_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get("action")

        print(f"Action: {action}, Data: {data}")
        try:
            if action == "update_active_conversation":
                await self.update_active_conversation(data)
            elif action == "send_message":
                await self.handle_send_message(data)
            elif action == "typing":
                await self.handle_typing_status(data)
            elif action == "mark_as_read":
                await self.handle_mark_as_read(data)
            elif action == "toggle_block_status":
                await self.handle_block_status(data)
        except Exception as e:
            print(f"Error handling action {action}: {str(e)}")
            await self.send(text_data=json.dumps({
                "type": "error",
                "message": str(e)
            }))

    async def handle_block_status(self, data):
        conversation_id = data.get("conversation_id")
        blocker_id = data.get("blocker_id")
        blocked_id = data.get("blocked_id")
        status = data.get("status")

        if not all([conversation_id, blocker_id, blocked_id]):
            raise ValueError("Missing required block status parameters")

        await self.toggle_block_status(conversation_id, blocker_id, blocked_id, status)
        await self.send_block_status_update(conversation_id, blocker_id, blocked_id)

    @sync_to_async
    def toggle_block_status(self, conversation_id, blocker_id, blocked_id, status):
        conversation = Conversation.objects.get(id=conversation_id)

        if status:
            if blocker_id == conversation.user1_id and blocked_id == conversation.user2_id:
                conversation.user1_block_status = "blocker"
                if conversation.user2_block_status != "blocker":
                    conversation.user2_block_status = "blocked"
            elif blocker_id == conversation.user2_id and blocked_id == conversation.user1_id:
                conversation.user2_block_status = "blocker"
                if conversation.user1_block_status != "blocker": 
                    conversation.user1_block_status = "blocked"
        else:
            if blocker_id == conversation.user1_id:
                if conversation.user2_block_status == "blocker": 
                    conversation.user1_block_status = "blocked"
                else:
                    conversation.user1_block_status = None
                    conversation.user2_block_status = None

            elif blocker_id == conversation.user2_id:
                if conversation.user1_block_status == "blocker":
                    conversation.user2_block_status = "blocked"
                else:
                    conversation.user1_block_status = None
                    conversation.user2_block_status = None


        conversation.save()


    async def send_block_status_update(self, conversation_id, blocker_id, blocked_id):
        await self.channel_layer.group_send(
            f"user_{blocker_id}",
            {
                "type": "block_status_update",
                "conversation_id": conversation_id,
                "blocker_id": blocker_id,
                "blocked_id": blocked_id,
                "block_status": "success"
            }
        )

        await self.channel_layer.group_send(
            f"user_{blocked_id}",
            {
                "type": "block_status_update",
                "conversation_id": conversation_id,
                "blocker_id": blocker_id,
                "blocked_id": blocked_id,
                "block_status": "success"
            }
        )
    
    async def block_status_update(self, event):
        await self.send(text_data=json.dumps({
            "type": "block_status_update",
            "conversation_id": event["conversation_id"],
            "blocker_id": event["blocker_id"],
            "blocked_id": event["blocked_id"],
            "block_status": event["block_status"],
        }))

    @sync_to_async
    def set_active_conversation(self, user_id, conversation_id):
        user = User.objects.get(id=user_id)
        user.active_conversation = conversation_id
        user.save()

    async def update_active_conversation(self, data):
        conversation_id = data.get("conversation_id")
        if conversation_id is not None:
            await self.set_active_conversation(self.user.id, conversation_id)
    
    async def handle_send_message(self, data):
        message = data.get("message")
        receiver_id = data.get("receiver_id") 
        sender_id = self.user.id

        if not receiver_id or not message:
            return

        conversation = await self.get_or_create_conversation(sender_id, receiver_id)

        print("---******user1_id*****---")
        print(conversation.user1_id)
        print("---******user2_id*****---")
        print(conversation.user2_id)

        if await self.is_conversation_blocked(conversation, sender_id):
            raise ValueError("Cannot send message. Conversation is blocked.")

        saved_conversation = await self.save_message(sender_id, receiver_id, message)

        await self.channel_layer.group_send(
            f"user_{sender_id}",
            {
                "type": "chat_message",
                "message": message,
                "sender_id": sender_id,
                "receiver_id": receiver_id,
                "conversation_id": saved_conversation.id,
            }
        )
        await self.channel_layer.group_send(
            f"user_{receiver_id}",
            {
                "type": "chat_message",
                "message": message,
                "sender_id": sender_id,
                "receiver_id": receiver_id,
                "conversation_id": saved_conversation.id,
            }
        )

    async def get_or_create_conversation(self, sender_id, receiver_id):
        return await sync_to_async(Conversation.objects.get)(
            user1_id=min(sender_id, receiver_id),
            user2_id=max(sender_id, receiver_id),
        )

    async def is_conversation_blocked(self, conversation, sender_id):
        conversation = await sync_to_async(Conversation.objects.get)(id=conversation.id)
        
        if sender_id == conversation.user1_id and conversation.user1_block_status == "blocked":
            return True
        if sender_id == conversation.user2_id and conversation.user2_block_status == "blocked":
            return True
        return False

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
        conversation_id = data.get("conversation_id")

        if not conversation_id:
            return

        await self.mark_conversation_as_read(conversation_id, self.user)

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
        print(f"Receiver ID: {receiver_id}, Sender ID: {sender_id}")


        conversation = Conversation.objects.get(
            user1=min(sender, receiver, key=lambda user: user.id),
            user2=max(sender, receiver, key=lambda user: user.id)
        )
        print(f"Conversation Users: {conversation.user1.id}, {conversation.user2.id}")

        Message.objects.create(
            conversation=conversation,
            sender=sender,
            receiver=receiver,
            content=message
        )
        conversation.last_message = message
        print(f" >>>> receiver_id,: {receiver_id}, conversation.id: {conversation.id} <<<<")
        print(f" >>>> receiver.active_conversation: {receiver.active_conversation}")
        is_active =  receiver.active_conversation == conversation.id
        print(f" >>>> is_active: {is_active}")
        if not is_active:
            if receiver == conversation.user1:
                conversation.unread_messages_user1 += 1
            elif receiver == conversation.user2:
                conversation.unread_messages_user2 += 1
            print(f"Unread User1: {conversation.unread_messages_user1}, Unread User2: {conversation.unread_messages_user2}")
        conversation.save()
        return conversation
    
    @sync_to_async
    def mark_conversation_as_read(self, conversation_id, user):
        conversation = Conversation.objects.get(id=conversation_id)

        if user == conversation.user1:
            conversation.unread_messages_user1 = 0
        elif user == conversation.user2:
            conversation.unread_messages_user2 = 0

        conversation.save()