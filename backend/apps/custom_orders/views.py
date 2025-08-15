from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import CustomOrder
from .serializers import CustomOrderSerializer


class CustomOrderViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciar pedidos customizados.
    """
    queryset = CustomOrder.objects.all()
    serializer_class = CustomOrderSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """
        Retorna apenas os pedidos do usuário autenticado.
        """
        return CustomOrder.objects.filter(user=self.request.user)
