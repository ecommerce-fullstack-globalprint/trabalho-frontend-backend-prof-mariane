from django.contrib import admin
from .models import CustomOrder

@admin.register(CustomOrder)
class CustomOrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'project_name', 'category', 'urgency', 'status', 'price', 'created_at')
    search_fields = ('project_name', 'user__username', 'category', 'status')
    list_filter = ('category', 'urgency', 'status', 'created_at')
