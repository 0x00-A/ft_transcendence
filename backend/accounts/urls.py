# from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.SignupView.as_view()),
    # path('signup/', views.signup_user),
    # path('login/', views.login_view),
    path('login/', views.LoginView.as_view()),
    # path('token/', TokenObtainPairView.as_view()),
    # path('token/refresh/', TokenRefreshView.as_view()),
    # path('profile/<str:username>/', views.profile_detail),
    path('profile/<str:username>/', views.ProfileDetail.as_view()),
]