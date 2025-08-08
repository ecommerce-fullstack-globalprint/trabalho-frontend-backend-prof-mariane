from django.contrib import admin
from .models import Order, OrderItem

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'user', 'status', 'total', 'created_at', 'delivery_date',
        'payment_method', 'address', 'city', 'state', 'zip_code', 'cpf', 'phone'
    )
    search_fields = ('id', 'user__email', 'cpf', 'status', 'city', 'state')
    list_filter = ('status', 'created_at', 'city', 'state', 'payment_method')
    ordering = ('-created_at',)
    fieldsets = (
        (None, {
            'fields': (
                'user', 'status', 'total', 'delivery_date',
                'payment_method', 'address', 'city', 'state', 'zip_code', 'cpf', 'phone'
            ),
        }),
    )

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'order', 'product', 'quantity', 'price')
    search_fields = ('order__id', 'product__id')
    list_filter = ('order', 'product')
    ordering = ('order',)
