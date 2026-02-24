from django.urls import path
from .views import RegisterView, LoginView, MeView, DoctorListView, DoctorChargeView

urlpatterns = [
    path('register/',       RegisterView.as_view()),
    path('login/',          LoginView.as_view()),
    path('me/',             MeView.as_view()),
    path('doctors/',        DoctorListView.as_view()),
    path('doctor/charges/', DoctorChargeView.as_view()),
]