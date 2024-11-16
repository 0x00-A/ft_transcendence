from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
from django.db.models import Q


class ConversationListView(APIView):
    """
    API View to get all conversations for the authenticated user.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            conversations = Conversation.objects.filter(Q(user1=user) | Q(user2=user))
            serializer = ConversationSerializer(conversations, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'error': 'Internal server error', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class MessageListView(APIView):
    """
    API View to get all messages in a specific conversation.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, conversation_id):
        try:
            user = request.user
            conversation = Conversation.objects.get(
                Q(id=conversation_id),
                Q(user1=user) | Q(user2=user)
            )
            messages = conversation.messages.all()
            serializer = MessageSerializer(messages, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Conversation.DoesNotExist:
            return Response(
                {'error': 'Conversation not found or access denied'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': 'Internal server error', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
