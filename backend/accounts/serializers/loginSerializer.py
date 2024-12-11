from rest_framework import serializers

from accounts.models import User



class LoginSerializer(serializers.ModelSerializer):

    username = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['username', 'password']

    def validate(self, attrs):
        try:
            user = User.objects.get(username=attrs['username'])
            if (not user.check_password(attrs['password'])):
                raise serializers.ValidationError(
                    {'password': 'password not valid'})
            if not user.is_active:
                raise serializers.ValidationError(
                    {'error': 'User is not active, Please verify your email and retry again!'})
        except User.DoesNotExist:
            raise serializers.ValidationError(
                {'username': 'username not exist'})
        return attrs