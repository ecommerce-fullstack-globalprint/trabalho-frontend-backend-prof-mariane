from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Payment
from .serializers import PaymentSerializer
from apps.orders.models import Order


class PaymentViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciar pagamentos.
    """
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """
        Retorna apenas os pagamentos dos pedidos do usuário autenticado.
        """
        return Payment.objects.filter(order__user=self.request.user)
    
    @action(detail=False, methods=['get'], url_path='by-order/(?P<order_id>[^/.]+)')
    def by_order(self, request, order_id=None):
        """
        Retorna os pagamentos de um pedido específico.
        """
        # Verificar se o pedido pertence ao usuário
        order = get_object_or_404(Order, id=order_id, user=request.user)
        payments = Payment.objects.filter(order=order)
        serializer = self.get_serializer(payments, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """
        Atualiza apenas o status do pagamento.
        """
        payment = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in [choice[0] for choice in Payment.PAYMENT_STATUS_CHOICES]:
            return Response(
                {'error': 'Status inválido'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        payment.status = new_status
        payment.save()
        
        serializer = self.get_serializer(payment)
        return Response(serializer.data)
