from django.db import models
from apps.orders.models import Order


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
    
    id = models.AutoField(primary_key=True, verbose_name="ID")
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

    class Meta:
        verbose_name = "Pagamento"
        verbose_name_plural = "Pagamentos"
        ordering = ['-created_at']

    def __str__(self):
        return f"Pagamento {self.id} - Pedido #{self.order.id} - {self.get_status_display()}"
