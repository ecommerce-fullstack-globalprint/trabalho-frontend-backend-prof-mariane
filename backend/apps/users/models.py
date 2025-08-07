from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
)
from django.db import models

from apps.users.service import UsuarioService


class Usuario(AbstractBaseUser, PermissionsMixin):
    nome = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    numero_telefone = models.CharField(max_length=20)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UsuarioService()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nome', 'numero_telefone']

    def __str__(self):
        return self.email
