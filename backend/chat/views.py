# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
from django.db.models import Q
from django.contrib.auth import get_user_model

User = get_user_model()

class CreateConversationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user1 = request.user
        user2_id = request.data.get("user2_id")

        if not user2_id:
            return Response({"error": "user2_id is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user2 = User.objects.get(id=user2_id)
            conversation, created = Conversation.objects.get_or_create(
                user1=min(user1, user2, key=lambda u: u.id),
                user2=max(user1, user2, key=lambda u: u.id)
            )

            serializer = ConversationSerializer(conversation)
            return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)


class GetConversationsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            user = request.user
            conversations = Conversation.objects.filter(
                Q(user1=user) | Q(user2=user)
            ).select_related('user1', 'user2').order_by('-updated_at')
            # conversations = Conversation.objects.filter(
            #     Q(user1=user) | Q(user2=user)
            # ).order_by('-updated_at')
            serializer = ConversationSerializer(conversations, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'error': 'Internal server error', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
class GetMessagesView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, conversation_id):
        try:
            user = request.user
            conversation = Conversation.objects.get(
                Q(id=conversation_id),
                Q(user1=user) | Q(user2=user)
            )
            messages = conversation.messages.all().order_by('timestamp')
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

class DeleteConversationView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, conversation_id):
        try:
            user = request.user
            conversation = Conversation.objects.get(
                Q(id=conversation_id),
                Q(user1=user) | Q(user2=user)
            )
            conversation.delete()
            return Response({"message": "Conversation deleted successfully."}, status=status.HTTP_200_OK)
        except Conversation.DoesNotExist:
            return Response(
                {"error": "Conversation not found or access denied."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": "Internal server error", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )