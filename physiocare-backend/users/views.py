from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status, generics
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model, authenticate
from .models import DoctorProfile
from .serializers import RegisterSerializer, UserSerializer, DoctorProfileSerializer, DoctorChargeSerializer

User = get_user_model()


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        s = RegisterSerializer(data=request.data)
        if s.is_valid():
            user = s.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'role': user.role,
                'tokens': {'access': str(refresh.access_token), 'refresh': str(refresh)},
            }, status=201)
        return Response(s.errors, status=400)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').lower().strip()
        password = request.data.get('password', '')
        try:
            user_obj = User.objects.get(email=email)
            user = authenticate(username=user_obj.username, password=password)
        except User.DoesNotExist:
            user = None

        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'role': user.role,
                'tokens': {'access': str(refresh.access_token), 'refresh': str(refresh)},
            })
        return Response({'error': 'Invalid email or password'}, status=400)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def patch(self, request):
        s = UserSerializer(request.user, data=request.data, partial=True)
        if s.is_valid():
            s.save()
            return Response(s.data)
        return Response(s.errors, status=400)


class DoctorListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = DoctorProfileSerializer
    queryset = DoctorProfile.objects.filter(is_active=True)


class DoctorChargeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            return Response(DoctorProfileSerializer(request.user.doctor_profile).data)
        except Exception:
            return Response({'error': 'Not a doctor'}, status=403)

    def patch(self, request):
        try:
            profile = request.user.doctor_profile
            s = DoctorChargeSerializer(profile, data=request.data, partial=True)
            if s.is_valid():
                s.save()
                return Response({'message': 'Charges updated!', 'data': s.data})
            return Response(s.errors, status=400)
        except Exception:
            return Response({'error': 'Not a doctor'}, status=403)


from django.shortcuts import render

# Create your views here.
