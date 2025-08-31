from django.contrib import admin
from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = [
        'id', 
        'user',
        'order', 
        'method', 
        'status', 
        'amount', 
        'transaction_id', 
        'created_at'
    ]
    list_filter = ['method', 'status', 'created_at', 'user']
    search_fields = ['transaction_id', 'order__id', 'user__email', 'user__nome']
    readonly_fields = ['created_at']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Informações do Pagamento', {
            'fields': ('user', 'order', 'method', 'status', 'amount', 'transaction_id')
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
