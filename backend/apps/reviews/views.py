from rest_framework import viewsets
from . import models, serializers


# Create your views here.
class ReviewView(viewsets.ModelViewSet):
    queryset = models.Review.objects.all()
    serializer_class = serializers.ReviewSerializer

    def get_serializer(self, *args, **kwargs):
        serializer = super().get_serializer(*args, **kwargs)
        # You can add any additional modifications to the serializer here
        return serializer
