from rest_framework import serializers
from apps.users.serializers import UsuarioOpitionSerializer
from .models import Cart, CartItem


class CartSerializer(serializers.ModelSerializer):

    class Meta:
        model = Cart
        fields = '__all__'


class CartListSerializer(serializers.ModelSerializer):
    user = UsuarioOpitionSerializer(read_only=True)
    created_at = serializers.DateTimeField(
        format="%Y-%m-%d %H:%M:%S",
        read_only=True
    )
    updated_at = serializers.DateTimeField(
        format="%Y-%m-%d %H:%M:%S",
        read_only=True
    )
    is_active = serializers.BooleanField(read_only=True)

    class Meta:
        model = Cart
        fields = '__all__'


class CartItemSerializer(serializers.ModelSerializer):
    cart = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = CartItem
        fields = '__all__'
