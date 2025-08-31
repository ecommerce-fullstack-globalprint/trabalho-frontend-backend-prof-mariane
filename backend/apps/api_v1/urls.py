from django.urls import path, include
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)
from rest_framework.routers import DefaultRouter
from apps.users import views as users_views
from apps.custom_orders import views as custom_orders_views
from apps.reviews import views as reviews_views
from apps.payments import views as payments_views


router = DefaultRouter()

router.register(
    r'usuarios',
    users_views.UsuarioView,
    basename='usuario'
)
router.register(
    r'custom-orders',
    custom_orders_views.CustomOrderViewSet,
    basename='custom-order'
)
router.register(
    r'reviews',
    reviews_views.ReviewView,
    basename='review'
)
router.register(
    r'payments',
    payments_views.PaymentViewSet,
    basename='payment'
)

urlpatterns = [
    path('api-auth/', include('rest_framework.urls')),
    path(
        "api/schema/",
        SpectacularAPIView.as_view(),
        name="schema"
    ),
    path(
        "api/swagger/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui"
    ),
    path(
        "api/redoc/",
        SpectacularRedocView.as_view(url_name="schema"),
        name="redoc"
    ),
    path('', include(router.urls)),
]
