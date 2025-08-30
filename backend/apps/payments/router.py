from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register(r'payments', views.PaymentViewSet, basename='payment')
