from rest_framework import viewsets
from apps.users import models, serializers


# Create your views here.
class UsuarioView(viewsets.ModelViewSet):
    queryset = models.Usuario.objects.all()
    serializer_class = serializers.UsuarioSerializer

    def get_serializer(self, *args, **kwargs):
        return super().get_serializer(*args, **kwargs)
