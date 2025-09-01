from django.db import models
from django.contrib.auth import get_user_model
from apps.orders.models import Order
import uuid

User = get_user_model()

class Payment(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ('pix', 'PIX'),
        ('credit_card', 'Cartão de Crédito'),
    ]
    
    PAYMENT_STATUS_CHOICES = [
        ('pendente', 'Pendente'),
        ('pago', 'Pago'),
        ('recusado', 'Recusado'),
        ('cancelled', 'Cancelado'),
        ('refunded', 'Reembolsado'),
    ]

    PROCESSED_STATUSES = ['pago', 'recusado', 'cancelled', 'refunded']
    
    id = models.AutoField(primary_key=True, verbose_name="ID")
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='payments', 
        verbose_name="Cliente",
        default=1  # Valor padrão temporário para a migração
    )
    order = models.ForeignKey(
        Order, 
        on_delete=models.CASCADE, 
        related_name='payments', 
        verbose_name="Pedido"
    )
    method = models.CharField(
        max_length=20, 
        choices=PAYMENT_METHOD_CHOICES, 
        verbose_name="Forma de Pagamento"
    )
    status = models.CharField(
        max_length=20, 
        choices=PAYMENT_STATUS_CHOICES, 
        default='pendente',
        verbose_name="Status do Pagamento"
    )
    amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        verbose_name="Valor Pago"
    )
    transaction_id = models.CharField(
        max_length=255, 
        unique=True, 
        verbose_name="ID da Transação",
        help_text="ID da transação retornado pelo Mercado Pago"
    )
    order = models.ForeignKey('orders.Order', on_delete=models.CASCADE)

    mercadopago_payment_id = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name="Payment ID Mercado Pago",
        help_text="ID único do pagamento no Mercado Pago"
    )
    mercadopago_preference_id = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name="Preference ID Mercado Pago",
        help_text="ID da preferência criada no Mercado Pago"
    )
    created_at = models.DateTimeField(
        auto_now_add=True, 
        verbose_name="Data do Registro"
    )

    updated_at = models.DateTimeField(auto_now=True, verbose_name="Última Atualização")

    class Meta:
        verbose_name = "Pagamento"
        verbose_name_plural = "Pagamentos"
        ordering = ['-created_at']

    def __str__(self):
        return f"Pagamento {self.id} - {str(self.user)} - Pedido #{self.order.id} - {self.get_status_display()}"
    
    def save(self, *args, **kwargs):
        """
        Sobrescreve o método save para aplicar validações de segurança.
        """

        # Gerar transaction_id apenas se não existir
        if not self.transaction_id:
            self.transaction_id = f"{self.order.id}_{uuid.uuid4().hex[:8]}"
        super().save(*args, **kwargs)

        # Se é uma atualização (pk existe)
        if self.pk:
            # Busca o objeto original no banco
            original = Payment.objects.get(pk=self.pk)

            if original.status in self.PROCESSED_STATUSES:
                # Campos críticos que não podem ser alterados
                protected_fields = {
                    'amount': 'valor',
                    'transaction_id': 'ID da transação',
                    'mercadopago_payment_id': 'ID do Mercado Pago',
                    'mercadopago_preference_id': 'ID da preferência',
                    'user': 'usuário',
                    'order': 'pedido'
                }
                
                # Verifica se algum campo protegido foi alterado
                for field_name, field_display in protected_fields.items():
                    original_value = getattr(original, field_name)
                    current_value = getattr(self, field_name)
                    
                    if original_value != current_value:
                        from django.core.exceptions import ValidationError
                        raise ValidationError(
                            f"Não é possível alterar o {field_display} de um pagamento "
                            f"com status '{original.get_status_display()}'"
                        )
        
        super().save(*args, **kwargs)
