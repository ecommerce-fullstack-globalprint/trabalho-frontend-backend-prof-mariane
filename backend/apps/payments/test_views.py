"""
Views para testar pagamentos no navegador.
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from .models import Payment
from .mercadopago_service import MercadoPagoService
from apps.orders.models import Order
from django.contrib.auth import get_user_model
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])  # Para facilitar o teste
def test_create_payment(request):
    """
    Endpoint para criar um pagamento de teste.
    Aceita: amount, description
    """
    try:
        amount = request.data.get('amount', 100.0)
        description = request.data.get('description', 'Pagamento de Teste')
        
        # Criar um usuário de teste se não existir
        user, created = User.objects.get_or_create(
            email='teste@teste.com',
            defaults={
                'nome': 'Usuario Teste',
                'is_active': True
            }
        )
        
        # Criar um pedido de teste se não existir
        order, created = Order.objects.get_or_create(
            user=user,
            defaults={
                'status': 'pendente',
                'total': amount,
                'payment_method': 'pix',
                'address': 'Endereço Teste',
                'city': 'São Paulo',
                'state': 'SP',
                'zip_code': '01000-000',
                'cpf': '123.456.789-00',
                'phone': '(11) 99999-9999'
            }
        )
        
        # Gerar um transaction_id único
        import uuid
        from django.utils import timezone
        
        transaction_id = f"TEST_{order.id}_{timezone.now().strftime('%Y%m%d%H%M%S')}_{str(uuid.uuid4())[:8]}"
        
        # Criar pagamento
        payment = Payment.objects.create(
            user=user,
            order=order,
            method='pix',
            amount=amount,
            transaction_id=transaction_id
        )
        
        # Gerar checkout do Mercado Pago
        mp_service = MercadoPagoService()
        result = mp_service.create_checkout_preference(payment, request)
        
        if result['success']:
            payment.mercadopago_preference_id = result['preference_id']
            payment.save()
            
            return Response({
                'success': True,
                'payment_id': payment.id,
                'checkout_url': result['checkout_url'],
                'preference_id': result['preference_id'],
                'public_key': result['public_key'],
                'amount': str(payment.amount),
                'description': description
            })
        else:
            error_details = result.get('details', '')
            error_causes = result.get('causes', [])
            full_error = result['error']
            
            if error_details:
                full_error += f" - {error_details}"
            if error_causes:
                full_error += f" - Causas: {', '.join([str(c) for c in error_causes])}"
                
            logger.error(f"Erro ao criar checkout para pagamento: {full_error}")
            return Response({
                'success': False,
                'error': full_error,
                'details': error_details,
                'causes': error_causes
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        logger.error(f"Erro ao criar pagamento de teste: {str(e)}")
        return Response({
            'success': False,
            'error': f'Erro interno: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def test_page(request):
    """
    Retorna uma página HTML simples para testar pagamentos.
    """
    html_content = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Teste Mercado Pago</title>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
            .form-group { margin-bottom: 15px; }
            label { display: block; margin-bottom: 5px; }
            input, button { padding: 10px; width: 100%; box-sizing: border-box; }
            button { background: #009ee3; color: white; border: none; cursor: pointer; }
            button:hover { background: #0084c2; }
            .result { margin-top: 20px; padding: 15px; background: #f0f0f0; border-radius: 5px; }
            .checkout-button { background: #00b2ff; margin-top: 10px; }
        </style>
    </head>
    <body>
        <h1>🛒 Teste de Pagamento - Mercado Pago</h1>
        
        <div style="margin-bottom: 20px;">
            <button id="testCredentials" style="background: #28a745; margin-bottom: 10px;">🔑 Testar Credenciais</button>
        </div>
        
        <form id="paymentForm">
            <div class="form-group">
                <label for="amount">Valor (R$):</label>
                <input type="number" id="amount" step="0.01" value="100.00" required>
            </div>
            <div class="form-group">
                <label for="description">Descrição:</label>
                <input type="text" id="description" value="Produto de Teste" required>
            </div>
            <button type="submit">💳 Criar Pagamento</button>
        </form>
        
        <div id="result" class="result" style="display: none;"></div>
        
        <script>
            // Testar credenciais
            document.getElementById('testCredentials').addEventListener('click', async function() {
                const resultDiv = document.getElementById('result');
                
                try {
                    const response = await fetch('/v1/payments/test-credentials/');
                    const data = await response.json();
                    
                    if (data.success) {
                        resultDiv.innerHTML = `
                            <h3>✅ Credenciais OK!</h3>
                            <p><strong>Sandbox:</strong> ${data.sandbox_mode ? 'Ativado' : 'Desativado'}</p>
                            <p><strong>Access Token:</strong> ${data.access_token_prefix}</p>
                            <p><strong>Public Key:</strong> ${data.public_key_prefix}</p>
                        `;
                    } else {
                        resultDiv.innerHTML = `
                            <h3>❌ Erro nas Credenciais</h3>
                            <p>${data.error}</p>
                        `;
                    }
                    
                    resultDiv.style.display = 'block';
                } catch (error) {
                    resultDiv.innerHTML = `
                        <h3>❌ Erro de Conexão</h3>
                        <p>${error.message}</p>
                    `;
                    resultDiv.style.display = 'block';
                }
            });
            
            // Criar pagamento
            document.getElementById('paymentForm').addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const amount = document.getElementById('amount').value;
                const description = document.getElementById('description').value;
                const resultDiv = document.getElementById('result');
                
                try {
                    const response = await fetch('/v1/payments/test-create/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            amount: parseFloat(amount),
                            description: description
                        })
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        resultDiv.innerHTML = `
                            <h3>✅ Pagamento Criado com Sucesso!</h3>
                            <p><strong>ID do Pagamento:</strong> ${data.payment_id}</p>
                            <p><strong>Valor:</strong> R$ ${data.amount}</p>
                            <p><strong>Preference ID:</strong> ${data.preference_id}</p>
                            <a href="${data.checkout_url}" target="_blank" class="checkout-button" style="display: inline-block; text-decoration: none; color: white; padding: 15px; text-align: center; border-radius: 5px;">
                                🔗 Ir para o Mercado Pago
                            </a>
                        `;
                    } else {
                        resultDiv.innerHTML = `
                            <h3>❌ Erro ao Criar Pagamento</h3>
                            <p>${data.error}</p>
                        `;
                    }
                    
                    resultDiv.style.display = 'block';
                    
                } catch (error) {
                    resultDiv.innerHTML = `
                        <h3>❌ Erro de Conexão</h3>
                        <p>${error.message}</p>
                    `;
                    resultDiv.style.display = 'block';
                }
            });
        </script>
    </body>
    </html>
    """
    
    from django.http import HttpResponse
    return HttpResponse(html_content, content_type='text/html')

@api_view(['GET'])
@permission_classes([AllowAny])
def test_credentials(request):
    """
    Testa se as credenciais do Mercado Pago estão funcionando.
    """
    try:
        from django.conf import settings
        
        # Verificar se as credenciais estão configuradas
        access_token = getattr(settings, 'MERCADO_PAGO_ACCESS_TOKEN', None)
        public_key = getattr(settings, 'MERCADO_PAGO_PUBLIC_KEY', None)
        sandbox = getattr(settings, 'MERCADO_PAGO_SANDBOX', True)
        
        if not access_token:
            return Response({
                'success': False,
                'error': 'MERCADO_PAGO_ACCESS_TOKEN não configurado'
            })
        
        if not public_key:
            return Response({
                'success': False,
                'error': 'MERCADO_PAGO_PUBLIC_KEY não configurado'
            })
        
        # Testar inicialização do SDK
        try:
            mp_service = MercadoPagoService()
            return Response({
                'success': True,
                'message': 'Credenciais configuradas corretamente',
                'sandbox_mode': sandbox,
                'access_token_prefix': access_token[:10] + '...' if access_token else None,
                'public_key_prefix': public_key[:10] + '...' if public_key else None
            })
        except Exception as e:
            return Response({
                'success': False,
                'error': f'Erro ao inicializar SDK: {str(e)}'
            })
            
    except Exception as e:
        return Response({
            'success': False,
            'error': f'Erro geral: {str(e)}'
        })
