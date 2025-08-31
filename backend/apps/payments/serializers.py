from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    """
    Serializer para o model Payment.
    """
    user_info = serializers.SerializerMethodField()
    order_info = serializers.SerializerMethodField()
    status_display = serializers.SerializerMethodField()
    method_display = serializers.SerializerMethodField()
    
    class Meta:
        model = Payment
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
        read_only_fields = ['id', 'created_at', 'user_info', 'order_info', 'status_display', 'method_display']
    
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
    
    def validate(self, attrs):
        """
        Validação customizada para impedir alteração de campos críticos 
        em pagamentos já processados.
        """
        # Se é uma atualização (instance existe)
        if self.instance:
            # Campos que não podem ser alterados após pagamento confirmado
            protected_fields = [
                'amount', 
                'transaction_id', 
                'mercadopago_payment_id', 
                'mercadopago_preference_id'
            ]
            
            # Se o pagamento já foi processado (pago, recusado, cancelado, reembolsado)
            processed_statuses = ['pago', 'recusado', 'cancelled', 'refunded']
            
            if self.instance.status in processed_statuses:
                for field in protected_fields:
                    if field in attrs and attrs[field] != getattr(self.instance, field):
                        raise serializers.ValidationError({
                            field: f"Campo '{field}' não pode ser alterado após o pagamento ser processado."
                        })
                
                # Também protege contra mudança do usuário e pedido
                if 'user' in attrs and attrs['user'] != self.instance.user:
                    raise serializers.ValidationError({
                        'user': "Usuário não pode ser alterado após o pagamento ser processado."
                    })
                
                if 'order' in attrs and attrs['order'] != self.instance.order:
                    raise serializers.ValidationError({
                        'order': "Pedido não pode ser alterado após o pagamento ser processado."
                    })
        
        return attrs
