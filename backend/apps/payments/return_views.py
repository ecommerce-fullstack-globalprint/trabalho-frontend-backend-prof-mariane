from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Payment
from django.core.exceptions import ValidationError

# Função auxiliar que centraliza a atualização do status do pagamento
def _update_payment_status(payment_id, new_status, collection_id=None):
    try:
        payment = get_object_or_404(Payment, id=payment_id)  # Busca pagamento ou retorna 404
        payment.status = new_status  # Atualiza status
        if collection_id:
            payment.mercadopago_payment_id = collection_id  # Atualiza ID do MP se fornecido
        payment.save()  # Salva no banco
        return True, None
    except Payment.DoesNotExist:
        return False, "Pagamento não encontrado"  # Caso pagamento não exista
    except ValidationError as e:
        return False, str(e)  # Caso falhe validação do modelo

@api_view(['GET'])
def payment_success(request):
    # Atualiza o pagamento como 'pago'
    payment_id = request.GET.get('external_reference')
    collection_id = request.GET.get('collection_id')
    success, error = _update_payment_status(payment_id, 'pago', collection_id)

    return Response({
        'success': success,
        'message': 'Pagamento aprovado com sucesso!' if success else error,
        'payment_id': payment_id,
        'collection_id': collection_id
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
def payment_failure(request):
    # Atualiza o pagamento como 'recusado'
    payment_id = request.GET.get('external_reference')
    collection_id = request.GET.get('collection_id')
    success, error = _update_payment_status(payment_id, 'recusado', collection_id)

    return Response({
        'success': success,
        'message': 'Pagamento recusado.' if success else error,
        'payment_id': payment_id,
        'collection_id': collection_id
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
def payment_pending(request):
    # Mantém pagamento como 'pendente' (ou atualiza ID MP se fornecido)
    payment_id = request.GET.get('external_reference')
    collection_id = request.GET.get('collection_id')
    success, error = _update_payment_status(payment_id, 'pendente', collection_id)

    return Response({
        'success': success,
        'message': 'Pagamento pendente de processamento.' if success else error,
        'payment_id': payment_id,
        'collection_id': collection_id
    }, status=status.HTTP_200_OK)
