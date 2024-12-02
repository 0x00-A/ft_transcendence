from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from accounts.models import Notification
from accounts.serializers import NotificationSerializer
from rest_framework.views import APIView


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Fetch only the current user's notifications
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')

    @action(detail=False, methods=['patch'], url_path='mark-all-read')
    def mark_all_read(self, request):
        notifications = self.get_queryset().filter(is_read=False)
        notifications.update(is_read=True)
        return Response({"message": "All notifications marked as read"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['patch'], url_path='mark-read')
    def mark_as_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({"message": f"Notification {pk} marked as read"}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['delete'], url_path='delete-all')
    def delete_all_notifications(self, request, pk=None):
        self.get_queryset().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class HasNewRequestsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response({'hasNewRequests': request.user.has_new_requests}, status=status.HTTP_200_OK)
