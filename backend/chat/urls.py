from django.urls import path
from .views import (
    GetConversationsView, DeleteConversationView,
    GetMessagesView, CreateConversationView
)

urlpatterns = [
    # Conversation
    path('conversations/', GetConversationsView.as_view(), name='get-conversations'),
    path('conversations/create/', CreateConversationView.as_view(), name='create-conversation'),
    # Message
    path('conversations/<int:conversation_id>/messages/', GetMessagesView.as_view(), name='get-messages'),
    path('conversations/<int:conversation_id>/delete/', DeleteConversationView.as_view(), name='delete_conversation'),
]
