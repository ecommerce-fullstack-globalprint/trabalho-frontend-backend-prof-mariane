# apps/custom_orders/viewsets/custom_order_viewset.py
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from apps.custom_orders.serializers import CustomOrderSerializer
from apps.custom_orders.services import CustomOrderService


class CustomOrderViewSet(viewsets.ViewSet):
    """
    ViewSet para gerenciar pedidos personalizados.
    - POST /api/custom-orders/ — Criar encomenda personalizada
    - GET /api/custom-orders/ — Listar encomendas do usuário autenticado
    - GET /api/custom-orders/{id}/ — Detalhes da encomenda
    - PATCH /api/custom-orders/{id}/status/ — Atualizar status (admin)
    """

    permission_classes = [IsAuthenticated]

    def list(self, request):
        """
        GET /api/custom-orders/
        Lista apenas os pedidos do usuário autenticado.
        """
        orders = CustomOrderService.list_order().filter(user=request.user)
        serializer = CustomOrderSerializer(orders, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        """
        GET /api/custom-orders/{id}/
        Detalhes de uma encomenda do usuário autenticado.
        """
        order = CustomOrderService.get_order(pk)
        if not order or order.user != request.user:
            return Response({"detail": "Pedido não encontrado"}, status=status.HTTP_404_NOT_FOUND)
        serializer = CustomOrderSerializer(order)
        return Response(serializer.data)

    def create(self, request):
        """
        POST /api/custom-orders/
        Cria uma encomenda personalizada para o usuário autenticado.
        """
        data = request.data.copy()
        data['user'] = request.user.id
        serializer = CustomOrderSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        order = CustomOrderService.create_order(**serializer.validated_data)
        return Response(CustomOrderSerializer(order).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['patch'], url_path='status', permission_classes=[IsAdminUser])
    def update_status(self, request, pk=None):
        """
        PATCH /api/custom-orders/{id}/status/
        Atualiza o status de uma encomenda (apenas admin).
        """
        status_value = request.data.get("status")
        if not status_value:
            return Response({"detail": "Campo 'status' é obrigatório"}, status=status.HTTP_400_BAD_REQUEST)
        order = CustomOrderService.update_status(pk, status_value)
        if not order:
            return Response({"detail": "Pedido não encontrado"}, status=status.HTTP_404_NOT_FOUND)
        serializer = CustomOrderSerializer(order)
        return Response(serializer.data)

    def update(self, request, pk=None):
        """
        PUT /api/custom-orders/{id}/
        Atualiza todos os campos de uma encomenda personalizada do usuário autenticado.
        """
        order = CustomOrderService.get_order(pk)
        if not order or order.user != request.user:
            return Response({"detail": "Pedido não encontrado"}, status=status.HTTP_404_NOT_FOUND)
        serializer = CustomOrderSerializer(order, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
