from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Order(models.Model):
    id = models.AutoField(primary_key=True, verbose_name="ID")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders', verbose_name="Usuário")
    status = models.CharField(max_length=30, verbose_name="Status")
    total = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Valor Total")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Data do Pedido")
    delivery_date = models.DateField(blank=True, null=True, verbose_name="Data de Entrega")
    payment_method = models.CharField(max_length=50, verbose_name="Forma de Pagamento")
    address = models.CharField(max_length=255, verbose_name="Endereço de Entrega")
    city = models.CharField(max_length=100, verbose_name="Cidade")
    state = models.CharField(max_length=50, verbose_name="Estado")
    zip_code = models.CharField(max_length=20, verbose_name="CEP")
    cpf = models.CharField(max_length=14, verbose_name="CPF do Comprador")
    phone = models.CharField(max_length=20, verbose_name="Telefone para Contato")

    class Meta:
        verbose_name = "Pedido"
        verbose_name_plural = "Pedidos"

    def __str__(self):
        return f"Pedido #{self.id} - {self.user}"

class OrderItem(models.Model):
    id = models.AutoField(primary_key=True, verbose_name="ID")
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items', verbose_name="Pedido")
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE, verbose_name="Produto")
    quantity = models.IntegerField(verbose_name="Quantidade")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Preço Unitário")

    class Meta:
        verbose_name = "Item do Pedido"
        verbose_name_plural = "Itens do Pedido"

    def __str__(self):
        return f"Item {self.id} do Pedido {self.order_id}"
