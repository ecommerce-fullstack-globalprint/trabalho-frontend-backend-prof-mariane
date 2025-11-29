from django.db import models


# Create your models here.
class Product(models.Model):
    id = models.AutoField(primary_key=True)
    nome = models.CharField(
        max_length=255,
        verbose_name="Nome do Produto"
    )
    descricao = models.TextField(
        verbose_name="Descrição",
        blank=True,
        null=True
    )
    preco = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Preço"
    )

    def __str__(self):
        return self.nome
