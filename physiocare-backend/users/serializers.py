from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import DoctorProfile

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password  = serializers.CharField(write_only=True, min_length=6)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model  = User
        fields = ['username','email','first_name','last_name','password','password2','role','phone','city']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        if user.role == 'doctor':
            DoctorProfile.objects.create(user=user)
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = ['id','username','email','first_name','last_name','role','phone','city']


class DoctorProfileSerializer(serializers.ModelSerializer):
    name  = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()

    class Meta:
        model  = DoctorProfile
        fields = '__all__'

    def get_name(self, obj):
        return obj.user.get_full_name() or obj.user.username

    def get_email(self, obj):
        return obj.user.email


class DoctorChargeSerializer(serializers.ModelSerializer):
    class Meta:
        model  = DoctorProfile
        fields = ['clinic_charge','home_visit_charge','home_visit_extra','home_visit_enabled']