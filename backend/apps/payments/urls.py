from django.urls import path, include
from .router import router
from . import return_views, test_views

urlpatterns = [
    path('', include(router.urls)),
    # URLs de retorno do Mercado Pago
    path('success/', return_views.payment_success, name='payment_success'),
    path('failure/', return_views.payment_failure, name='payment_failure'),
    path('pending/', return_views.payment_pending, name='payment_pending'),
    # URLs de teste
    path('test/', test_views.test_page, name='payment_test_page'),
    path('test-create/', test_views.test_create_payment, name='test_create_payment'),
    path('test-credentials/', test_views.test_credentials, name='test_credentials'),
]
