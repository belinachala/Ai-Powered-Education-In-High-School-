from django.contrib import admin
from .models import DepartmentHeadProfile

admin.site.register(DepartmentHeadProfile)

 
class DepartmentHeadAdmin(admin.ModelAdmin):
    list_display = ("first_name", "last_name", "university_name", "department_name", "employee_id")
    search_fields = ("first_name", "last_name", "university_name", "department_name", "employee_id")
