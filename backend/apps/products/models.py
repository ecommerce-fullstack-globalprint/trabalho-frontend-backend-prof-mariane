from django.db import models


# Create your models here.
class Product(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=100)
    type = models.CharField(max_length=50)
    image = models.ImageField(upload_to="products/", blank=True, null=True)
    rating = models.FloatField(default=0.0)
    downloads = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
