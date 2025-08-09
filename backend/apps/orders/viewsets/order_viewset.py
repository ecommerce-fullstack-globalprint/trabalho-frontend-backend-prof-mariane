from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from apps.orders.serializers import OrderSerializer
from apps.orders.services import OrderService
from apps.orders.models import Order

# ViewSet para gerenciar pedidos via API REST
# Permite criar, listar, detalhar e atualizar status de pedidos
# Segue o padrão da arquitetura custom_orders
class OrderViewSet(viewsets.ViewSet):
    """
    ViewSet para gerenciar pedidos.
    - POST /api/orders/ — Criar pedido
    - GET /api/orders/ — Listar pedidos do usuário autenticado
    - GET /api/orders/{id}/ — Detalhes do pedido
    - PATCH /api/orders/{id}/status/ — Atualizar status (admin)
    """
    permission_classes = [IsAuthenticated]

    def list(self, request):
        """Lista todos os pedidos do usuário autenticado."""
        orders = OrderService.list_orders().filter(user=request.user)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        """Retorna os detalhes de um pedido do usuário autenticado."""
        order = OrderService.get_order(pk)
        if not order or order.user != request.user:
            return Response({"detail": "Pedido não encontrado"}, status=status.HTTP_404_NOT_FOUND)
        serializer = OrderSerializer(order)
        return Response(serializer.data)

    def create(self, request):
        """Cria um novo pedido para o usuário autenticado."""
        data = request.data.copy()
        data['user'] = request.user.id
        serializer = OrderSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        order = OrderService.create_order(**serializer.validated_data)
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['patch'], url_path='status', permission_classes=[IsAdminUser])
    def update_status(self, request, pk=None):
        """Atualiza o status de um pedido (apenas admin)."""
        status_value = request.data.get("status")
        if not status_value:
            return Response({"detail": "Campo 'status' é obrigatório"}, status=status.HTTP_400_BAD_REQUEST)
        order = OrderService.update_status(pk, status_value)
        if not order:
            return Response({"detail": "Pedido não encontrado"}, status=status.HTTP_404_NOT_FOUND)
        serializer = OrderSerializer(order)
        return Response(serializer.data)

    def update(self, request, pk=None):
        """Atualiza todos os campos de um pedido do usuário autenticado."""
        order = OrderService.get_order(pk)
        if not order or order.user != request.user:
            return Response({"detail": "Pedido não encontrado"}, status=status.HTTP_404_NOT_FOUND)
        serializer = OrderSerializer(order, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
