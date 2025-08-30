from django.contrib import admin
from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = [
        'id', 
        'order', 
        'method', 
        'status', 
        'amount', 
        'transaction_id', 
        'created_at'
    ]
    list_filter = ['method', 'status', 'created_at']
    search_fields = ['transaction_id', 'order__id', 'order__user__username']
    readonly_fields = ['created_at']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Informações do Pagamento', {
            'fields': ('order', 'method', 'status', 'amount', 'transaction_id')
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
