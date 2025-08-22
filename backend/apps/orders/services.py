# Serviço para operações de negócio relacionadas ao modelo Order
# Centraliza regras de criação, listagem, busca e atualização de pedidos
from apps.orders.models import Order, OrderItem

class OrderService:
    @staticmethod
    def create_order(**kwargs):
        """Cria um novo pedido com os dados fornecidos."""
        return Order.objects.create(**kwargs)

    @staticmethod
    def list_orders():
        """Retorna todos os pedidos cadastrados."""
        return Order.objects.all()

    @staticmethod
    def get_order(order_id):
        """Busca um pedido pelo ID."""
        try:
            return Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return None

    @staticmethod
    def update_status(order_id, new_status):
        """Atualiza o status de um pedido pelo ID."""
        try:
            order = Order.objects.get(id=order_id)
            order.status = new_status
            order.save()
            return order
        except Order.DoesNotExist:
            return None
