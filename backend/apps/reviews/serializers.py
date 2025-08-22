from rest_framework import serializers
from . import models


class ReviewSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(source='product.id', read_only=True)
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    created_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = models.Review
        fields = '__all__'
