from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Appointment
from .serializers import AppointmentSerializer, CreateAppointmentSerializer


class AppointmentListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        u = request.user
        if u.role == 'patient': qs = Appointment.objects.filter(patient=u)
        elif u.role == 'doctor': qs = Appointment.objects.filter(doctor=u)
        elif u.role == 'admin':  qs = Appointment.objects.all()
        else:                    qs = Appointment.objects.none()
        return Response(AppointmentSerializer(qs, many=True).data)

    def post(self, request):
        if request.user.role != 'patient':
            return Response({'error': 'Only patients can book.'}, status=403)
        s = CreateAppointmentSerializer(data=request.data, context={'request': request})
        if s.is_valid():
            return Response(AppointmentSerializer(s.save()).data, status=201)
        return Response(s.errors, status=400)


class AppointmentDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            appt = Appointment.objects.get(pk=pk)
        except Appointment.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)

        u = request.user
        if u.role == 'doctor' and appt.doctor != u:
            return Response({'error': 'Not your appointment'}, status=403)

        new_status = request.data.get('status')
        if new_status:
            appt.status = new_status
            appt.save()
            return Response(AppointmentSerializer(appt).data)
        return Response({'error': 'Provide status'}, status=400)