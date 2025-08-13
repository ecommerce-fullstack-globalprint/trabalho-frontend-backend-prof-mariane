from django.conf import settings
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class Review(models.Model):
    product_id = models.ForeignKey(
        'products.Product',
        on_delete=models.CASCADE
    )
    user_id = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    rating = models.PositiveSmallIntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(5)
        ],
        help_text="Nota de 1 a 5"
    )
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=models.Q(rating__gte=1) & models.Q(rating__lte=5),
                name="review_rating_between_1_and_5",
            )
        ]
