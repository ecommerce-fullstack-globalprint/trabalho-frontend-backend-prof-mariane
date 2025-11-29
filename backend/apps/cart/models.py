from django.db import models


# Create your models here.
class Cart(models.Model):
    user = models .ForeignKey(
        'users.Usuario',
        on_delete=models.CASCADE,
        related_name='carts',
        null=True,
        blank=True
    )
    session_key = models.CharField(
        max_length=40,
        null=True,
        blank=True,
        db_index=True,
        help_text="Chave de sessão para usuários anônimos"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user'],
                condition=models.Q(is_active=True),
                name='unique_active_cart_per_user'
            ),
            models.UniqueConstraint(
                fields=['session_key'],
                condition=models.Q(is_active=True),
                name='unique_active_cart_per_session'
            ),
            models.CheckConstraint(
                check=models.Q(user__isnull=True, session_key__isnull=True) |
                models.Q(user__isnull=False, session_key__isnull=True),
                name='cart_requeires_user_or_session'
            )
        ]


class CartItem(models.Model):
    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name='items'
    )
    product = models.ForeignKey(
        'products.Product',
        on_delete=models.CASCADE
    )
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['cart', 'product'],
                name='unique_product_per_cart'
            )
        ]
