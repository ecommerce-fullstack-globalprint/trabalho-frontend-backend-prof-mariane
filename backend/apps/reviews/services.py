from django.db import transaction
from rest_framework.exceptions import ValidationError, PermissionDenied
from .models import Review


def list_reviews(product_id: int | None = None):
    qs = Review.objects.all()
    if product_id:
        qs = qs.filter(product_id=product_id)
    return qs

@transaction.atomic
def update_review(*, review: Review, user, rating: int | None = None, comment: str | None = None) -> Review:
    if review.user_id != user:
        raise PermissionDenied("Você não pode editar esta avaliação.")
    if rating is not None:
        review.rating = rating
    if comment is not None:
        review.comment = comment
    review.full_clean()
    review.save()
    return review

@transaction.atomic
def delete_review(*, review: Review, user) -> None:
    if review.user_id != user:
        raise PermissionDenied("Você não pode excluir esta avaliação.")
    review.delete()