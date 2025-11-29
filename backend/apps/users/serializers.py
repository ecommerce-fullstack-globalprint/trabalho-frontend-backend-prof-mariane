from django.contrib.auth import get_user_model
from rest_framework import serializers

# Importa o model User padrão do Django
User = get_user_model()


class UsuarioSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo User.
    Serializa os campos principais e garante que a senha seja salva de forma segura.
    """

    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'nome', 'email', 'numero_telefone', 'password']

    def validate_password(self, value):
        """
        Valida se a senha é forte (mínimo de 8 caracteres).
        """
        if len(value) < 8:
            raise serializers.ValidationError("A senha deve ter pelo menos 8 caracteres.")
        return value

    def create(self, validated_data):
        """
        Cria um novo usuário usando o método create_user para garantir que a senha seja salva de forma segura.
        """
        password = validated_data.pop('password')
        user = User.objects.create_user(password=password, **validated_data)
        return user


class UsuarioOpitionSerializer(serializers.ModelSerializer):
    nome = serializers.CharField(source='get_full_name', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'nome']
