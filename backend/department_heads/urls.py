from django.urls import path
from .views import DepartmentHeadProfileCreateView

urlpatterns = [
    path('', DepartmentHeadProfileCreateView.as_view(), name='department_head_create'),
]
