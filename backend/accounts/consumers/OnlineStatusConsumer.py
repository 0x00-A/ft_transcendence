# from channels.generic.websocket import AsyncWebsocketConsumer
# from asgiref.sync import sync_to_async
# from channels.db import database_sync_to_async
# from django.utils import timezone
# from django.contrib.auth import get_user_model
# from accounts.models import Profile
# from django.contrib.auth.models import AnonymousUser


# User = get_user_model()


# class OnlineStatusConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         user = self.scope['user']
#         self.user = None

#         if user.is_authenticated:
#             print('api socket ==> OnlineStatusConsumer: User is connected')
#             self.user = self.scope['user']
#             await self.accept()
#             await self.set_online_status(True)
#             await self.send(text_data=f"Hello {self.user.username}, you are authenticated!")
#         else:
#             print(
#                 'api socket ==> OnlineStatusConsumer: User is not authenticated connection rejected')
#             await self.close()

#     async def disconnect(self, close_code):
#         print('api socket ==> OnlineStatusConsumer: User disconnected')
#         await self.set_online_status(False)
#         return await super().disconnect(close_code)

#     @database_sync_to_async
#     def set_online_status(self, is_online):
#         # This function is now synchronous, so no `async` is needed
#         if self.user:
#             profile = Profile.objects.get(user=self.user)
#             profile.is_online = is_online
#             profile.save()
