from rest_framework import serializers
from .models import Appointment

class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    doctor_name  = serializers.SerializerMethodField()

    class Meta:
        model  = Appointment
        fields = '__all__'
        read_only_fields = ['patient', 'amount', 'created_at']

    def get_patient_name(self, obj): return obj.patient.get_full_name() or obj.patient.username
    def get_doctor_name(self, obj):  return obj.doctor.get_full_name()  or obj.doctor.username


class CreateAppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Appointment
        fields = ['doctor','service','date','time','type','notes','address']

    def create(self, validated_data):
        from users.models import DoctorProfile
        patient = self.context['request'].user
        try:
            p      = DoctorProfile.objects.get(user=validated_data['doctor'])
            amount = p.home_visit_charge if validated_data.get('type') == 'home' else p.clinic_charge
        except DoctorProfile.DoesNotExist:
            amount = 0
        return Appointment.objects.create(patient=patient, amount=amount, **validated_data)