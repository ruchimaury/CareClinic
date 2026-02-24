from django.contrib import admin
from .models import Appointment


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display  = ['patient_name', 'doctor_name', 'service', 'date', 'time', 'type', 'amount', 'status']
    list_filter   = ['status', 'type', 'date']
    search_fields = ['patient__first_name', 'patient__last_name', 'doctor__first_name', 'service']
    list_editable = ['status']
    ordering      = ['-created_at']
    date_hierarchy = 'date'

    def patient_name(self, obj):
        return obj.patient.get_full_name() or obj.patient.username
    patient_name.short_description = 'Patient'

    def doctor_name(self, obj):
        return f"Dr. {obj.doctor.get_full_name()}"
    doctor_name.short_description = 'Doctor'
from django.contrib import admin

# Register your models here.
