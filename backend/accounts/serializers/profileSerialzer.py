from rest_framework import serializers
from ..models.profile import Profile


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    full_name = serializers.CharField(source='user.get_full_name')
#     avatar = serializers.file

    class Meta:
        model = Profile
        fields = ['id', 'username', 'full_name',
                  'avatar', 'stats', 'is_online', 'age', 'level']
