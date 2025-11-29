from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(
    r'carts',
    views.CartViewSet,
    basename='cart'
)
# router.register(
#     r'cart-items',
#     views.CartItemViewSet,
#     basename='cart-item'
# )
