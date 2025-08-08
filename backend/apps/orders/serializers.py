from rest_framework import serializers
from .models import Order, OrderItem
from apps.products.serializers import ProductSerializer

# Serializers para conversão dos modelos Order e OrderItem em JSON para API REST.
# Permitem criar, listar e detalhar pedidos e seus itens, incluindo detalhes do produto.

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'status', 'total', 'created_at', 'delivery_date',
            'payment_method', 'address', 'city', 'state', 'zip_code', 'cpf', 'phone', 'items'
        ]
