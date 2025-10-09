from rest_framework import viewsets, permissions
from .models import Cart
from .serializers import CartSerializer, CartListSerializer


class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CartSerializer

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return CartListSerializer
        return CartSerializer

# Create your views here.
