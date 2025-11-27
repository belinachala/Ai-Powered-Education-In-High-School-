from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DirectorProfileViewSet

router = DefaultRouter()
router.register(r'profiles', DirectorProfileViewSet, basename='directorprofile')

urlpatterns = [
    path('', include(router.urls)),
]