from rest_framework import viewsets
from .models import DirectorProfile
from .serializers import DirectorProfileSerializer

class DirectorProfileViewSet(viewsets.ModelViewSet):
    queryset = DirectorProfile.objects.all()
    serializer_class = DirectorProfileSerializer