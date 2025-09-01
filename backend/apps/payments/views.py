from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import JsonResponse
from django.utils import timezone
import json
import logging
import traceback

from .models import Payment
from .serializers import PaymentSerializer
from .mercadopago_service import MercadoPagoService
from apps.orders.models import Order

logger = logging.getLogger(__name__)


class PaymentViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciar pagamentos.
    """
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    # --- Querysets ---
    def get_queryset(self):
        """Retorna apenas os pagamentos do usuário autenticado."""
        return Payment.objects.filter(order__user=self.request.user)

    # --- Métodos privados ---
    def _get_mp_service(self):
        """Retorna uma instância do serviço do Mercado Pago."""
        return MercadoPagoService()

    def _get_or_create_payment(self, order, payment_method='pix'):
        """
        Retorna pagamento pendente existente ou cria um novo.
        """
        payment = Payment.objects.filter(order=order, status='pendente').first()
        if not payment:
            payment = Payment.objects.create(
                user=order.user,
                order=order,
                method=payment_method,
                amount=order.total,
                transaction_id=f"PAY_{order.id}_{timezone.now().strftime('%Y%m%d%H%M%S')}"
            )
        return payment

    def _create_checkout(self, payment, request):
        """
        Cria checkout do Mercado Pago para o pagamento.
        """
        mp_service = self._get_mp_service()
        result = mp_service.create_checkout_preference(payment, request)

        if result['success']:
            payment.mercadopago_preference_id = result['preference_id']
            payment.save()
            return {
                'success': True,
                'payment_id': payment.id,
                'preference_id': result['preference_id'],
                'init_point': result['checkout_url'],
                'sandbox_init_point': result.get('sandbox_checkout_url'),
                'public_key': result['public_key'],
                'amount': str(payment.amount),
                'status': payment.status
            }
        else:
            logger.error(f"Erro ao criar checkout: {result}")
            return {'success': False, 'error': result['error']}

    # --- Ações públicas ---
    @action(detail=False, methods=['get'], url_path='by-order/(?P<order_id>[^/.]+)')
    def by_order(self, request, order_id=None):
        """Retorna os pagamentos de um pedido específico."""
        order = get_object_or_404(Order, id=order_id, user=request.user)
        payments = Payment.objects.filter(order=order)
        serializer = self.get_serializer(payments, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Atualiza apenas o status do pagamento."""
        payment = self.get_object()
        new_status = request.data.get('status')

        if new_status not in [choice[0] for choice in Payment.PAYMENT_STATUS_CHOICES]:
            return Response({'error': 'Status inválido'}, status=status.HTTP_400_BAD_REQUEST)

        payment.status = new_status
        payment.save()

        serializer = self.get_serializer(payment)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='create-checkout')
    def create_checkout(self, request):
        """Cria um checkout do Mercado Pago para um pagamento existente."""
        try:
            payment_id = request.data.get('payment_id')
            if not payment_id:
                return Response({'error': 'payment_id é obrigatório'}, status=400)

            payment = get_object_or_404(Payment, id=payment_id, order__user=request.user)

            if payment.status != 'pendente':
                return Response({'error': 'Pagamento não está mais pendente'}, status=400)

            return Response(self._create_checkout(payment, request))

        except Exception:
            logger.error(traceback.format_exc())
            return Response({'error': 'Erro interno do servidor'}, status=500)

    @action(detail=False, methods=['post'], permission_classes=[], url_path='webhook')
    @method_decorator(csrf_exempt)
    def webhook(self, request):
        """Recebe notificações webhook do Mercado Pago."""
        try:
            logger.info(f"Webhook recebido: {request.body}")

            data = json.loads(request.body) if request.content_type == 'application/json' else dict(request.POST)

            result = self._get_mp_service().process_webhook_notification(data)

            if result['success']:
                return JsonResponse({'status': 'ok'})
            else:
                logger.error(f"Erro ao processar webhook: {result}")
                return JsonResponse({'status': 'error'}, status=400)

        except json.JSONDecodeError:
            logger.error("Webhook com JSON inválido")
            return JsonResponse({'status': 'invalid json'}, status=400)
        except Exception:
            logger.error(traceback.format_exc())
            return JsonResponse({'status': 'error'}, status=500)

    @action(detail=True, methods=['get'], url_path='mercadopago-status')
    def mercadopago_status(self, request, pk=None):
        """Consulta o status atual do pagamento no Mercado Pago."""
        payment = self.get_object()
        if not payment.mercadopago_payment_id:
            return Response({'error': 'Pagamento não possui ID do Mercado Pago'}, status=400)

        try:
            result = self._get_mp_service().get_payment_info(payment.mercadopago_payment_id)
            if result['success']:
                mp_payment = result['payment']
                return Response({
                    'payment_id': payment.id,
                    'mercadopago_status': mp_payment.get('status'),
                    'status_detail': mp_payment.get('status_detail'),
                    'payment_method': mp_payment.get('payment_method_id'),
                    'transaction_amount': mp_payment.get('transaction_amount'),
                    'date_created': mp_payment.get('date_created'),
                    'date_approved': mp_payment.get('date_approved')
                })
            else:
                return Response({'error': result['error']}, status=400)

        except Exception:
            logger.error(traceback.format_exc())
            return Response({'error': 'Erro interno do servidor'}, status=500)

    @action(detail=False, methods=['post'], url_path='create-from-order')
    def create_from_order(self, request):
        """Cria um pagamento a partir de um pedido e gera o checkout."""
        try:
            order_id = request.data.get('order_id')
            payment_method = request.data.get('payment_method', 'pix')

            if not order_id:
                return Response({'error': 'order_id é obrigatório'}, status=400)

            order = get_object_or_404(Order, id=order_id, user=request.user)
            payment = self._get_or_create_payment(order, payment_method)

            result = self._create_checkout(payment, request)
            if result.get('success'):
                return Response(result, status=201)
            else:
                return Response({'error': result['error']}, status=500)

        except Exception:
            logger.error(traceback.format_exc())
            return Response({'error': 'Erro interno do servidor'}, status=500)
