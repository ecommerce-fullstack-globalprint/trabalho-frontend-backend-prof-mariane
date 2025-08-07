#!/usr/bin/env python
"""
Script para configuração inicial do banco PostgreSQL
"""
import os

import sys
import subprocess
from pathlib import Path


def run_command(command, description):
    """Executa um comando e mostra o resultado"""
    print(f"\n🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} - Sucesso!")
        if result.stdout:
            print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} - Erro!")
        print(f"Erro: {e.stderr}")
        return False


def main():
    """Função principal"""
    print("🐘 Configuração do PostgreSQL para Django")
    print("=" * 50)

    # Verificar se o arquivo .env existe
    env_file = Path(".env")
    if not env_file.exists():
        print("❌ Arquivo .env não encontrado!")
        print("Por favor, configure o arquivo .env conforme o POSTGRES_SETUP.md")
        return

    # Ler configurações do .env
    print("📄 Lendo configurações do .env...")

    # Verificar se psycopg2 está instalado
    try:
        import psycopg2
        print("✅ psycopg2-binary está instalado")
    except ImportError:
        print("❌ psycopg2-binary não está instalado")
        print("Execute: pip install psycopg2-binary")
        return

    # Executar comandos Django
    commands = [
        ("python manage.py check", "Verificando configuração Django"),
        ("python manage.py makemigrations", "Criando migrações"),
        ("python manage.py migrate", "Aplicando migrações"),
    ]

    for command, description in commands:
        if not run_command(command, description):
            print(f"\n❌ Falha em: {description}")
            print("Verifique as configurações do banco de dados no arquivo .env")
            return

    print("\n🎉 Configuração concluída com sucesso!")
    print("\nPróximos passos:")
    print("1. Execute: python manage.py createsuperuser")
    print("2. Execute: python manage.py runserver")


if __name__ == "__main__":
    main()
