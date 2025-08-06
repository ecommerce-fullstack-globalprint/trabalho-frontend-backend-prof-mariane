from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

# Pedido customizado feito por um usuário
class CustomOrder(models.Model):
    id = models.AutoField(primary_key=True, verbose_name="ID")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='custom_orders', verbose_name="Usuário")
    project_name = models.CharField(max_length=255, verbose_name="Nome do Projeto")
    category = models.CharField(max_length=100, verbose_name="Categoria")
    urgency = models.CharField(max_length=50, verbose_name="Urgência")
    description = models.TextField(verbose_name="Descrição")
    shirt_style = models.CharField(max_length=100, blank=True, null=True, verbose_name="Estilo da Camiseta")
    colors = models.CharField(max_length=100, blank=True, null=True, verbose_name="Cores")
    size = models.CharField(max_length=50, blank=True, null=True, verbose_name="Tamanho")
    style = models.CharField(max_length=100, blank=True, null=True, verbose_name="Estilo")
    text = models.CharField(max_length=255, blank=True, null=True, verbose_name="Texto")
    reference_files = models.JSONField(blank=True, null=True, verbose_name="Arquivos de Referência")
    status = models.CharField(max_length=50, default='em análise', verbose_name="Status")
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, verbose_name="Preço")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Data de Criação")

    def __str__(self):
        return f"{self.project_name} ({self.user})"
    
    # Define o nome que será exibido no admin (Singular e no Plural)
    class Meta:
        verbose_name = "Pedido personalizado"
        verbose_name_plural = "Pedidos personalizados"
