"""
Serviço para integração com Mercado Pago usando Checkout Pro.
"""
import logging
from decimal import Decimal
from sysconfig import scheme
from typing import Dict, Any, Optional
from django.conf import settings
from django.urls import reverse
from pydantic.v1.schema import schema

from .models import Payment

# Configurar logging
logger = logging.getLogger(__name__)

class MercadoPagoService:
    """
    Serviço para gerenciar pagamentos com Mercado Pago usando Checkout Pro.
    """
    
    def __init__(self):
        """Inicializa o serviço com as credenciais do Mercado Pago."""

        self.access_token = getattr(settings, 'MERCADO_PAGO_ACCESS_TOKEN', None)
        self.public_key = getattr(settings, 'MERCADO_PAGO_PUBLIC_KEY', None)
        self.sandbox = getattr(settings, 'MERCADO_PAGO_SANDBOX', True)
        
        if not self.access_token or not self.public_key:
            raise ValueError("Mercado Pago não configurado nas settings")

        logger.info(f"Mercado Pago inicializado  em modo %s", "SANDBOX" if self.sandbox else "PRODUÇÃO")

        @property
        def sdk(self):
            if self._sdk is None:
                import mercadopago
                self._sdk = mercadopago.SDK(self.access_token)
            return self._sdk
    
    def create_checkout_preference(self, payment: Payment, request=None) -> Dict[str, Any]:
        """
        Cria uma preferência de checkout no Mercado Pago.
        
        Args:
            payment: Instância do modelo Payment
            request: Request HTTP para gerar URLs completas
            
        Returns:
            Dict com os dados da preferência criada
        """
        try:
            # Obter dados do pedido e usuário
            order = payment.order
            user = payment.user
            
            # URLs de retorno (você pode personalizar conforme sua necessidade)
            base_url = self._get_base_url(request)
            logger.info(f"Base URL gerada: {base_url}")
            
            # Dados da preferência
            preference_data = {
                "items": [
                    {
                        "id": str(order.id),
                        "title": f"Pedido #{order.id}",
                        "description": f"Pagamento do pedido #{order.id}",
                        "category_id": "others",
                        "quantity": 1,
                        "currency_id": "BRL",
                        "unit_price": float(payment.amount)
                    }
                ],
                "payer": {
                    "name": user.nome,
                    "email": user.email
                },
                "back_urls": {
                    "success": f"{base_url}/v1/payments/success/",
                    "failure": f"{base_url}/v1/payments/failure/",
                    "pending": f"{base_url}/v1/payments/pending/"
                },
                "external_reference": str(payment.id),
                "notification_url": f"{base_url}/v1/payments/webhook/"
            }
            
            # Configurar métodos de pagamento (versão simplificada)
            # Remover configurações específicas para testar
            
            # Criar preferência no Mercado Pago
            logger.info(f"Criando preferência com dados: {preference_data}")
            
            try:
                response = self.sdk.preference().create(preference_data)
                logger.info(f"Resposta do MP - Status: {response.get('status')}")
                logger.info(f"Resposta do MP - Response: {response.get('response', {})}")
                logger.info(f"Resposta completa: {response}")
            except Exception as api_error:
                logger.error(f"Erro na API do Mercado Pago: {str(api_error)}")
                logger.error(f"Tipo do erro: {type(api_error)}")
                return {
                    "success": False,
                    "error": f"Erro na API do Mercado Pago: {str(api_error)}"
                }
            
            if response["status"] == 201:
                preference = response["response"]
                
                # Salvar ID da preferência no pagamento
                payment.mercadopago_preference_id = preference["id"]
                payment.save()
                
                logger.info(f"Preferência criada com sucesso: {preference['id']}")
                
                return {
                    "success": True,
                    "preference_id": preference["id"],
                    "checkout_url": preference["init_point"], # URL real
                    "sandbox_checkout_url": preference["sandbox_init_point"] if self.sandbox else None,
                    "public_key": self.public_key
                }
            else:
                # Capturar mais detalhes do erro
                error_message = response.get("message", "Erro desconhecido")
                error_details = response.get("cause", [])
                error_response = response.get("response", {})
                
                logger.error(f"Erro ao criar preferência:")
                logger.error(f"  Status: {response.get('status')}")
                logger.error(f"  Message: {error_message}")
                logger.error(f"  Cause: {error_details}")
                logger.error(f"  Response: {error_response}")
                logger.error(f"  Full response: {response}")
                
                # Tentar extrair mais informações do erro
                detailed_error = error_message
                if error_response:
                    if isinstance(error_response, dict):
                        if 'message' in error_response:
                            detailed_error = error_response['message']
                        if 'cause' in error_response:
                            detailed_error += f" - {error_response['cause']}"
                
                return {
                    "success": False,
                    "error": f"Erro ao criar preferência (Status: {response.get('status', 'unknown')}) - {detailed_error}",
                    "details": error_message,
                    "causes": error_details,
                    "raw_response": response
                }
                
        except Exception as e:
            logger.error(f"Erro inesperado ao criar preferência: {str(e)}")
            return {
                "success": False,
                "error": "Erro interno do servidor",
                "details": str(e)
            }
    
    def get_payment_info(self, payment_id: str) -> Dict[str, Any]:
        """
        Obtém informações de um pagamento pelo ID do Mercado Pago.
        
        Args:
            payment_id: ID do pagamento no Mercado Pago
            
        Returns:
            Dict com informações do pagamento
        """
        try:
            response = self.sdk.payment().get(payment_id)
            
            if response["status"] == 200:
                return {
                    "success": True,
                    "payment": response["response"]
                }
            else:
                logger.error(f"Erro ao buscar pagamento {payment_id}: {response}")
                return {
                    "success": False,
                    "error": "Pagamento não encontrado"
                }
                
        except Exception as e:
            logger.error(f"Erro ao buscar pagamento {payment_id}: {str(e)}")
            return {
                "success": False,
                "error": "Erro interno do servidor",
                "details": str(e)
            }
    
    def process_webhook_notification(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Processa notificações webhook do Mercado Pago.
        
        Args:
            data: Dados recebidos no webhook
            
        Returns:
            Dict com resultado do processamento
        """
        try:
            # Extrair informações da notificação
            notification_type = data.get("type")
            notification_id = data.get("id")
            
            if notification_type != "payment":
                return {
                    "success": True,
                    "message": "Tipo de notificação não processada"
                }
            
            # Buscar informações do pagamento
            payment_info = self.get_payment_info(notification_id)
            
            if not payment_info["success"]:
                return payment_info
            
            mp_payment = payment_info["payment"]
            external_reference = mp_payment.get("external_reference")
            
            if not external_reference:
                logger.warning(f"Pagamento {notification_id} sem external_reference")
                return {
                    "success": False,
                    "error": "Referência externa não encontrada"
                }
            
            # Buscar pagamento no banco de dados
            try:
                payment = Payment.objects.get(id=external_reference)
            except Payment.DoesNotExist:
                logger.error(f"Pagamento com ID {external_reference} não encontrado")
                return {
                    "success": False,
                    "error": "Pagamento não encontrado no sistema"
                }
            
            # Atualizar status do pagamento baseado no status do MP
            mp_status = mp_payment.get("status")
            payment.mercadopago_payment_id = str(notification_id)
            
            # Mapear status do MP para status interno
            status_mapping = {
                "approved": "pago",
                "pending": "pendente",
                "in_process": "pendente",
                "rejected": "recusado",
                "cancelled": "cancelled",
                "refunded": "refunded"
            }
            
            new_status = status_mapping.get(mp_status, "pendente")
            
            if payment.status != new_status:
                payment.status = new_status
                payment.save()
                
                logger.info(f"Status do pagamento {payment.id} atualizado para {new_status}")
            
            return {
                "success": True,
                "message": "Pagamento processado com sucesso",
                "payment_id": payment.id,
                "new_status": new_status
            }
            
        except Exception as e:
            logger.error(f"Erro ao processar webhook: {str(e)}")
            return {
                "success": False,
                "error": "Erro interno do servidor",
                "details": str(e)
            }
    
    def _get_base_url(self, request) -> str:
        """
        Obtém a URL base do sistema.
        
        Args:
            request: Request HTTP
            
        Returns:
            URL base como string
        """
        if request:
            scheme = 'https' if request.is_secure() else 'http'
            host = request.get_host()
            return f"{scheme}://{host}"
        
        # Para desenvolvimento local - usar ngrok ou URL pública para produção
        #return "http://localhost:8000"
        import os
        return os.getenv("BASE_URL", "https://localhost:8000")
