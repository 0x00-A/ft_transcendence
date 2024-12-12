from rest_framework import serializers

from accounts.models import Achievement, UserAchievement
from django.conf import settings

class AchievementSerializer(serializers.ModelSerializer):

    image = serializers.SerializerMethodField()

    class Meta:
        model = Achievement
        fields = ['name', 'description', 'condition_name', 'condition', 'reward_points', 'image',
                  'progress_percentage', 'is_unlocked']

    def get_image(self, obj):
        return f'{settings.SERVER_URL}{obj.image}'

class UserAchievementsSerializer(serializers.ModelSerializer):
    achievement = AchievementSerializer()

    class Meta:
        model = UserAchievement
        fields = ['achievement', 'progress', 'is_unlocked', 'unlocked_at']
        # depth = 1


    # def validate(self, attrs):
    #     try:
    #         user = User.objects.get(username=attrs['username'])
    #         if (not user.check_password(attrs['password'])):
    #             raise serializers.ValidationError(
    #                 {'password': 'password not valid'})
    #         if not user.is_active:
    #             raise serializers.ValidationError(
    #                 {'error': 'User is not active, Please verify your email and retry again!'})
    #     except User.DoesNotExist:
    #         raise serializers.ValidationError(
    #             {'username': 'username not exist'})
    #     return attrs