from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

# Pedido customizado feito por um usuário
class CustomOrder(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='custom_orders')
    project_name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    urgency = models.CharField(max_length=50)
    description = models.TextField()
    shirt_style = models.CharField(max_length=100, blank=True, null=True)
    colors = models.CharField(max_length=100, blank=True, null=True)
    size = models.CharField(max_length=50, blank=True, null=True)
    style = models.CharField(max_length=100, blank=True, null=True)
    text = models.CharField(max_length=255, blank=True, null=True)
    reference_files = models.JSONField(blank=True, null=True)
    status = models.CharField(max_length=50, default='em análise')
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.project_name} ({self.user})"
