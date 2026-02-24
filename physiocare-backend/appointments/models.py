from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Appointment(models.Model):
    STATUS = [('pending','Pending'),('confirmed','Confirmed'),('completed','Completed'),('cancelled','Cancelled')]
    TYPE   = [('clinic','Clinic Visit'),('home','Home Visit')]

    patient    = models.ForeignKey(User, on_delete=models.CASCADE, related_name='as_patient')
    doctor     = models.ForeignKey(User, on_delete=models.CASCADE, related_name='as_doctor')
    service    = models.CharField(max_length=200)
    date       = models.DateField()
    time       = models.CharField(max_length=20)
    type       = models.CharField(max_length=10, choices=TYPE, default='clinic')
    amount     = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    status     = models.CharField(max_length=15, choices=STATUS, default='pending')
    notes      = models.TextField(blank=True)
    address    = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']