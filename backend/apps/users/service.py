from django.contrib.auth.models import BaseUserManager
from django.contrib.auth import get_user_model


class UsuarioService(BaseUserManager):
    """Serviço para gerenciar usuários"""

    def create_user(self, email, nome, numero_telefone, password=None):
        """Cria um usuário comum"""
        if not email:
            raise ValueError("Usuário precisa de um email")

        email = self.normalize_email(email)
        user = self.model(
            email=email,
            nome=nome,
            numero_telefone=numero_telefone
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(
            self,
            email=None,
            nome=None,
            numero_telefone=None,
            password=None
    ):
        """Cria um superusuário com valores padrão se não fornecidos"""
        user = self.create_user(email, nome, numero_telefone, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

    def get_by_email(self, email):
        """Busca usuário por email"""
        try:
            return self.get(email=email)
        except self.model.DoesNotExist:
            return None

    def activate_user(self, user_id):
        """Ativa um usuário"""
        user = self.get(id=user_id)
        user.is_active = True
        user.save()
        return user

    def deactivate_user(self, user_id):
        """Desativa um usuário"""
        user = self.get(id=user_id)
        user.is_active = False
        user.save()
        return user


class UsuarioBusinessService:
    """Serviço de lógica de negócio para usuários"""

    def __init__(self):
        self.user = get_user_model()

    def criar_usuario_completo(self, dados_usuario):
        """Cria usuário com validações de negócio"""
        # Validações específicas do negócio
        if self.email_ja_existe(dados_usuario['email']):
            raise ValueError("Email já cadastrado")

        return self.user.objects.create_user(**dados_usuario)

    def email_ja_existe(self, email):
        return self.user.objects.filter(email=email).exists()

    def buscar_usuarios_ativos(self):
        return self.user.objects.filter(is_active=True)
