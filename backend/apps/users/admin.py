from django.contrib import admin

from apps.users.models import Usuario


@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = (
        'email',
        'nome',
        'numero_telefone',
        'is_active',
        'is_staff'
    )
    list_filter = ('is_active', 'is_staff')
    search_fields = ('email', 'nome', 'numero_telefone')
    ordering = ('email',)

# Register your models here.
