from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('patient', 'Patient'),
        ('doctor',  'Doctor'),
        ('admin',   'Admin'),
    ]
    role   = models.CharField(max_length=10, choices=ROLE_CHOICES, default='patient')
    phone  = models.CharField(max_length=15, blank=True)
    city   = models.CharField(max_length=100, blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)

    def __str__(self):
        return f"{self.get_full_name()} ({self.role})"


class DoctorProfile(models.Model):
    user               = models.OneToOneField(User, on_delete=models.CASCADE, related_name='doctor_profile')
    specialization     = models.CharField(max_length=200, default='Physiotherapist')
    experience_years   = models.IntegerField(default=0)
    bio                = models.TextField(blank=True)
    clinic_charge      = models.DecimalField(max_digits=8, decimal_places=2, default=800)
    home_visit_charge  = models.DecimalField(max_digits=8, decimal_places=2, default=1000)
    home_visit_extra   = models.DecimalField(max_digits=8, decimal_places=2, default=200)
    home_visit_enabled = models.BooleanField(default=True)
    rating             = models.FloatField(default=5.0)
    is_active          = models.BooleanField(default=True)
    created_at         = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Dr. {self.user.get_full_name()}"