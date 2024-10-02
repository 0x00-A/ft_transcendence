from django.urls import path
from . import views
from rest_framework import routers

router = routers.SimpleRouter()
router.register(r'accounts', views.AccountsList)

url_patterns = router.urls 