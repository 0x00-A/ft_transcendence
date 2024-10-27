# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from ..models import Profile
from ..serializers import ProfileSerializer

class AllUsersView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        profiles = Profile.objects.all()
        serializer = ProfileSerializer(profiles, many=True)
        return Response(serializer.data)

# class ProfileModelViewSet(ViewSet):
#     queryset = Profile.objects.all()
#     serializer_class = ProfileSerializer

# @api_view()
# @permission_classes([IsAuthenticated])
# def profiles_list(request):
#     if request.method == 'GET':
#         query_set = Profile.objects.all()
#         serializer = ProfileSerializer
