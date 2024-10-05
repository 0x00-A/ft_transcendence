from django.urls import path
from . import views
# from rest_framework import routers

# router = routers.SimpleRouter()
# router.register(r'accounts', views.AccountsList)

urlpatterns = [
    path('signup/', views.createAccount.as_view()),
]