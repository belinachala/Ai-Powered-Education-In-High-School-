# director/serializers.py

from rest_framework import serializers
from .models import DirectorProfile

class DirectorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DirectorProfile
        fields = '__all__'