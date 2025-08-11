from apps.custom_orders.models import CustomOrder

class CustomOrderService:
    # Atualizar Status
    @staticmethod
    def update_status(order_id, new_status):
        try:
            order = CustomOrder.objects.get(id=order_id)
            order.status = new_status
            order.save()
            return order
        except CustomOrder.DoesNotExist:
            return None

    # Criar pedido
    @staticmethod
    def create_order(**kwargs):
        return CustomOrder.objects.create(**kwargs)

    # Listar pedidos
    @staticmethod
    def list_order():
        return CustomOrder.objects.all()

    # Obter pedido por id
    @staticmethod
    def get_order(order_id):
        try:
            return CustomOrder.objects.get(id=order_id)
        except CustomOrder.DoesNotExist:
            return None
