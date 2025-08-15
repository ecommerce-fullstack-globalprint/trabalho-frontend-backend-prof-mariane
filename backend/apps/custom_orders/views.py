from rest_framework import viewsets
from . import models, serializers


class CustomOrderViewSet(viewsets.ModelViewSet):
    """ViewSet para gerenciar pedidos customizados"""
    queryset = models.CustomOrder.objects.all()
    serializer_class = serializers.CustomOrderSerializer
    
    def get_queryset(self):
        """Filtra pedidos por usuário se não for admin"""
        queryset = super().get_queryset()
        if not self.request.user.is_staff:
            queryset = queryset.filter(user=self.request.user)
        return queryset