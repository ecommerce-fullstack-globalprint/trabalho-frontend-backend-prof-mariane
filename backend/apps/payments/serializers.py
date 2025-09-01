from rest_framework import serializers
from .models import Payment

# Constantes para status processados e campos protegidos
PROCESSED_STATUSES = ['pago', 'recusado', 'cancelled', 'refunded']
PROTECTED_FIELDS = [
    'amount',
    'transaction_id',
    'mercadopago_payment_id',
    'mercadopago_preference_id'
]


class PaymentSerializer(serializers.ModelSerializer):
    """
    Serializer para o model Payment.
    Permite leitura detalhada de informações do usuário e do pedido,
    e valida alterações em campos críticos de pagamentos já processados.
    """

    # Campos extras para exibição legível de usuário e pedido
    user_info = serializers.SerializerMethodField()
    order_info = serializers.SerializerMethodField()
    status_display = serializers.SerializerMethodField()
    method_display = serializers.SerializerMethodField()

    class Meta:
        model = Payment
        # Todos os campos do Payment + campos extras
        fields = [
            'id',
            'user',
            'user_info',
            'order',
            'order_info',
            'method',
            'method_display',
            'status',
            'status_display',
            'amount',
            'transaction_id',
            'mercadopago_payment_id',
            'mercadopago_preference_id',
            'created_at',
        ]
        # Campos de leitura apenas
        read_only_fields = [
            'id', 'created_at', 'user_info', 'order_info', 'status_display', 'method_display'
        ]

    # ---------------- Métodos para exibição legível ---------------- #

    def get_user_info(self, obj):
        """
        Retorna informações básicas do usuário/cliente.
        """
        return {
            'id': obj.user.id,
            'nome': obj.user.nome,
            'email': obj.user.email,
        }

    def get_order_info(self, obj):
        """
        Retorna informações básicas do pedido relacionado.
        """
        return {
            'id': obj.order.id,
            'user': obj.order.user.email,
            'user_name': obj.order.user.nome,
            'total': obj.order.total,
            'status': obj.order.status
        }

    def get_status_display(self, obj):
        """
        Retorna o status do pagamento em formato legível.
        """
        return obj.get_status_display()

    def get_method_display(self, obj):
        """
        Retorna o método de pagamento em formato legível.
        """
        return obj.get_method_display()

    # ---------------- Validação customizada ---------------- #

    def validate(self, attrs):
        """
        Impede alterações de campos críticos em pagamentos já processados.
        """
        # Se é criação, não precisa validar
        if not self.instance:
            return attrs

        # Se pagamento já processado
        if self.instance.status in PROCESSED_STATUSES:
            # Verifica campos protegidos
            for field in PROTECTED_FIELDS:
                if field in attrs and attrs[field] != getattr(self.instance, field):
                    raise serializers.ValidationError({
                        field: f"Campo '{field}' não pode ser alterado após o pagamento ser processado."
                    })

            # Também protege usuário e pedido
            for field in ['user', 'order']:
                if field in attrs and attrs[field] != getattr(self.instance, field):
                    raise serializers.ValidationError({
                        field: f"{field.capitalize()} não pode ser alterado após o pagamento ser processado."
                    })

        return attrs
