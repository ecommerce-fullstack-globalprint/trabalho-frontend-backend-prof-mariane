# Configuração do PostgreSQL

## Pré-requisitos

1. **Instalar PostgreSQL**
   - Baixe e instale o PostgreSQL em: https://www.postgresql.org/download/
   - Durante a instalação, lembre-se da senha do usuário `postgres`

## Configuração

### 1. Criar o banco de dados

Abra o terminal/cmd e execute:

```bash
# Conectar ao PostgreSQL como usuário postgres
psql -U postgres

# Criar o banco de dados
CREATE DATABASE trabalho_frontend_backend;

# Criar um usuário específico (opcional, mas recomendado)
CREATE USER django_user WITH PASSWORD 'sua_senha_segura';

# Dar permissões ao usuário
GRANT ALL PRIVILEGES ON DATABASE trabalho_frontend_backend TO django_user;

# Sair do psql
\q
```

### 2. Configurar as variáveis de ambiente

Edite o arquivo `.env` na raiz do projeto backend e configure:

```env
# PostgreSQL Configuration
DB_ENGINE=django.db.backends.postgresql
DB_NAME=trabalho_frontend_backend
DB_USER=postgres
DB_PASSWORD=sua_senha_do_postgres
DB_HOST=localhost
DB_PORT=5432
```

**Importante:** Substitua `sua_senha_do_postgres` pela senha que você definiu durante a instalação do PostgreSQL.

### 3. Aplicar as migrações

```bash
# Ativar o ambiente virtual
.\.venv\Scripts\Activate.ps1

# Criar as migrações
python manage.py makemigrations

# Aplicar as migrações
python manage.py migrate

# Criar um superusuário
python manage.py createsuperuser
```

### 4. Testar a conexão

```bash
# Verificar se não há erros
python manage.py check

# Iniciar o servidor
python manage.py runserver
```

## Alternativa: Usar SQLite (desenvolvimento)

Se preferir usar SQLite para desenvolvimento, você pode comentar as configurações do PostgreSQL no `.env` ou definir:

```env
DB_ENGINE=django.db.backends.sqlite3
DB_NAME=db.sqlite3
```

## Problemas Comuns

1. **Erro de conexão:** Verifique se o PostgreSQL está rodando
2. **Erro de autenticação:** Verifique usuário e senha no `.env`
3. **Banco não existe:** Execute o comando CREATE DATABASE no psql
