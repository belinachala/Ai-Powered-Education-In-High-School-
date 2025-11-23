from rest_framework import serializers
from .models import DepartmentHeadProfile

class DepartmentHeadProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DepartmentHeadProfile
        fields = '__all__'
