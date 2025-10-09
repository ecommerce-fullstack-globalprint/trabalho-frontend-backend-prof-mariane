from rest_framework import serializers
from .models import CustomOrder


# Converter os dados para JSON
class CustomOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomOrder
        fields = [
            'id',
            'user',
            'project_name',
            'category',
            'urgency',
            'description',
            'shirt_style',
            'colors',
            'size',
            'style',
            'text',
            'reference_files',
            'status',
            'price',
            'created_at',
        ]
        