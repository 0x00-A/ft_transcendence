from django.urls import path
from .views import (
    GetConversationsView,
    GetMessagesView, CreateConversationView, CreateMessageView
)

urlpatterns = [
    # Conversation
    path('conversations/', GetConversationsView.as_view(), name='get-conversations'),
    # Message
    path('conversations/<int:conversation_id>/messages/', GetMessagesView.as_view(), name='get-messages'),
    path('conversations/create/', CreateConversationView.as_view(), name='create-conversation'),
    path('messages/create/', CreateMessageView.as_view(), name='create-message'),
]
