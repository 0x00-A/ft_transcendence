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
            
            serializer = ConversationSerializer(conversations, many=True)
            conversations_data = []

            for conversation in serializer.data:
                if user.id == conversation['user1_id']:
                    other_user_id = conversation['user2_id']
                    other_user_username = conversation['user2_username']
                    other_user_avatar = conversation['user2_avatar']
                else:
                    other_user_id = conversation['user1_id']
                    other_user_username = conversation['user1_username']
                    other_user_avatar = conversation['user1_avatar']

                conversation_data = {
                    'id': conversation['id'],
                    'user_id': other_user_id,  
                    'avatar': other_user_avatar, 
                    'name': other_user_username, 
                    'lastMessage': conversation['last_message'][:10] + '...' if len(conversation['last_message']) > 10 else conversation['last_message'],
                    'time': conversation['updated_at'],
                    'unreadCount': conversation['unread_messages'] or 0,
                    'status': conversation['is_online'],
                    'blocked': False,  
                }
                conversations_data.append(conversation_data)

            return Response(conversations_data, status=status.HTTP_200_OK)
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