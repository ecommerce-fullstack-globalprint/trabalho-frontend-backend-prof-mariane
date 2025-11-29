from decimal import Decimal
from django.db.models import F, Sum, ExpressionWrapper
from apps.cart import models


class CartService:
    def __init__(self, cart: models.Cart):
        self.cart = cart

    def get_total_items(self) -> Decimal:
        subtotal_expr = ExpressionWrapper(
            F('price') * F('quantity'),
            output_field=models.DecimalField(max_digits=10, decimal_places=2)
        )
        result = models.Cart.objects.filter(pk=self.pk).aggregate(total=Sum(subtotal_expr))
        return result['total'] or Decimal('0.00')

    def get_item_count(self) -> int:
        result = self.cart.items.aggregate(total_quantity=Sum('quantity'))
        return int(result['total_quantity'] or 0)

    def clear(self):
        self.cart.items.all().delete()
