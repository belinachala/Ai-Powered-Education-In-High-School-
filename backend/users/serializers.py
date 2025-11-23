from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import CustomUser

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = CustomUser
        fields = [
            'email',
            'first_name',
            'last_name',
            'phone_number',
            'password',
            'user_type',
            'role',
        ]

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        user = CustomUser.objects.create(**validated_data)
        return user

# Serializer for returning user info after login
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'first_name', 'last_name', 'role', 'user_type']
