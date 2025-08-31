"""
Views para retorno do Mercado Pago - API JSON.
"""
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Payment


@api_view(['GET'])
def payment_success(request):
    """Endpoint de sucesso do pagamento."""
    payment_id = request.GET.get('external_reference')
    collection_id = request.GET.get('collection_id')
    collection_status = request.GET.get('collection_status')
    
    # Atualizar status do pagamento se encontrado
    if payment_id:
        try:
            payment = get_object_or_404(Payment, id=payment_id)
            payment.status = 'pago'
            if collection_id:
                payment.mercadopago_payment_id = collection_id
            payment.save()
        except Payment.DoesNotExist:
            pass
    
    return Response({
        'success': True,
        'message': 'Pagamento aprovado com sucesso!',
        'payment_id': payment_id,
        'collection_id': collection_id,
        'status': collection_status
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
def payment_failure(request):
    """Endpoint de falha do pagamento."""
    payment_id = request.GET.get('external_reference')
    collection_id = request.GET.get('collection_id')
    collection_status = request.GET.get('collection_status')
    
    # Atualizar status do pagamento se encontrado
    if payment_id:
        try:
            payment = get_object_or_404(Payment, id=payment_id)
            payment.status = 'recusado'
            if collection_id:
                payment.mercadopago_payment_id = collection_id
            payment.save()
        except Payment.DoesNotExist:
            pass
    
    return Response({
        'success': False,
        'message': 'Pagamento recusado.',
        'payment_id': payment_id,
        'collection_id': collection_id,
        'status': collection_status
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
def payment_pending(request):
    """Endpoint de pagamento pendente."""
    payment_id = request.GET.get('external_reference')
    collection_id = request.GET.get('collection_id')
    collection_status = request.GET.get('collection_status')
    
    # Manter status pendente
    if payment_id:
        try:
            payment = get_object_or_404(Payment, id=payment_id)
            if collection_id:
                payment.mercadopago_payment_id = collection_id
            payment.save()
        except Payment.DoesNotExist:
            pass
    
    return Response({
        'success': None,
        'message': 'Pagamento pendente de processamento.',
        'payment_id': payment_id,
        'collection_id': collection_id,
        'status': collection_status
    }, status=status.HTTP_200_OK)
