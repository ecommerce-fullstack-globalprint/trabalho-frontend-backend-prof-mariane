from django.urls import path, include
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)
from rest_framework.routers import DefaultRouter
from apps.users import views as users_views


router = DefaultRouter()

router.register(r'usuarios', users_views.UsuarioView, basename='usuario')

urlpatterns = [
    path('api-auth/', include('rest_framework.urls')),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/swagger/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
    path('', include(router.urls)),  # Adiciona as rotas do router
]
