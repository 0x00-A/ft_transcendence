# urls.py
from django.urls import path
from .views import (
    GetConversationsView,
    GetMessagesView,
)

urlpatterns = [
    # Conversation
    path('conversations/', GetConversationsView.as_view(),
         name='get-conversations'),
    # Message
    path('conversations/<int:conversation_id>/messages/',
         GetMessagesView.as_view(), name='get-messages'),
]
