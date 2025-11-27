from django.db import models

class DirectorProfile(models.Model):
    GENDER_CHOICES = (
        ('male', 'Male'),
        ('female', 'Female'),
    )

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    gender = models.CharField(max_length=6, choices=GENDER_CHOICES)
    date_of_birth = models.DateField()
    school_name = models.CharField(max_length=255)
    region = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    woreda = models.CharField(max_length=100)
    zone = models.CharField(max_length=100)
    years_of_experience = models.PositiveIntegerField()
    profile_picture = models.ImageField(upload_to='director_profiles/', blank=True, null=True)
    # you can add a ForeignKey to your user model for ownership

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.school_name})"