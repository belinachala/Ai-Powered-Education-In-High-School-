from django.db import models

class DepartmentHeadProfile(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    gender = models.CharField(max_length=10)
    date_of_birth = models.DateField()
    phone_number = models.CharField(max_length=20)
    university_name = models.CharField(max_length=255)
    department_name = models.CharField(max_length=255)
    position = models.CharField(max_length=255)
    employee_id = models.CharField(max_length=50)
    years_of_experience = models.PositiveIntegerField()
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)  # Auto set creation time
    updated_at = models.DateTimeField(auto_now=True)      # Auto update on save
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.department_name}"
