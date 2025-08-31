# 💳 Sistema de Pagamentos - Integração Mercado Pago

## 📋 Sobre o Projeto

Sistema completo de pagamentos integrado com **Mercado Pago Checkout Pro**, desenvolvido em Django REST Framework. Permite criar pagamentos, processar transações e receber notificações em tempo real via webhook.

## 🚀 Funcionalidades

- ✅ **Criação de pagamentos** a partir de pedidos
- 🌐 **Redirecionamento automático** para checkout do Mercado Pago
- 🔄 **Webhook** para atualização automática de status
- 📊 **Consulta de status** de pagamentos
- 🛡️ **Validações de segurança** robustas
- 🧪 **Ambiente de teste** completo
- 💳 **Suporte a PIX e Cartão de Crédito**

## 🛠️ Tecnologias

- **Django 5.2.4**
- **Django REST Framework 3.16.0**
- **Mercado Pago SDK 2.2.1**
- **PostgreSQL**
- **Docker & Docker Compose**

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Configure o arquivo `.env` com suas credenciais do Mercado Pago:

```env
# Mercado Pago Configuration
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-seu-access-token-aqui
MERCADO_PAGO_PUBLIC_KEY=APP_USR-seu-public-key-aqui
MERCADO_PAGO_SANDBOX=True
```

### 2. Obter Credenciais do Mercado Pago

1. Acesse [developers.mercadopago.com.br](https://developers.mercadopago.com.br)
2. Faça login na sua conta
3. Vá em **"Suas aplicações"** → **"Criar aplicação"**
4. Copie o `Access Token` e `Public Key` de **teste** (sandbox)

### 3. Instalação com Docker

```bash
# Clone o repositório
git clone <seu-repositorio>
cd backend

# Inicie os containers
docker-compose up --build

# Execute as migrações
docker-compose exec web python manage.py migrate

# Crie um superusuário (opcional)
docker-compose exec web python manage.py createsuperuser
```

## 📡 Endpoints da API

### 🔑 Autenticação

A maioria dos endpoints requer autenticação. Adicione o header:

```
Authorization: Bearer <seu-token>
```

### 📝 Principais Endpoints

#### 1. Criar Pagamento a partir de Pedido

```http
POST /v1/payments/create-from-order/
Content-Type: application/json

{
  "order_id": 123,
  "payment_method": "pix"  // ou "credit_card"
}
```

**Resposta:**

```json
{
  "payment_id": 456,
  "preference_id": "12345-67890-abcde",
  "init_point": "https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=...",
  "public_key": "APP_USR-...",
  "amount": "100.00",
  "status": "pendente"
}
```

#### 2. Consultar Status do Pagamento

```http
GET /v1/payments/{payment_id}/mercadopago-status/
```

#### 3. Webhook (Configurado Automaticamente)

```http
POST /v1/payments/webhook/
```

#### 4. URLs de Retorno

- **Sucesso:** `GET /v1/payments/success/`
- **Falha:** `GET /v1/payments/failure/`
- **Pendente:** `GET /v1/payments/pending/`

## 🧪 Testando a Integração

### 1. Página de Teste

Acesse: `http://localhost:8000/v1/payments/test/`

Esta página permite:

- ✅ Testar credenciais do Mercado Pago
- 💳 Criar pagamentos de teste
- 🔗 Redirecionar para checkout do MP

### 2. Cartões de Teste

**Para APROVAR pagamentos:**

```
Número: 4509 9535 6623 3704
CVV: 123
Vencimento: 11/25
Nome: APRO
```

**Para RECUSAR pagamentos:**

```
Número: 5031 7557 3453 0604
CVV: 123
Vencimento: 11/25
Nome: OTHE
```

## 🔗 Integração com Frontend

### Exemplo JavaScript/React

```javascript
// Função para iniciar pagamento
async function iniciarPagamento(orderId) {
  try {
    const response = await fetch("/v1/payments/create-from-order/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        order_id: orderId,
        payment_method: "pix",
      }),
    });

    const data = await response.json();

    if (data.payment_id) {
      // Redirecionar para Mercado Pago
      window.location.href = data.init_point;
    }
  } catch (error) {
    console.error("Erro ao criar pagamento:", error);
  }
}
```

### Fluxo Completo

1. **Cliente finaliza pedido** no frontend
2. **Frontend chama API** para criar pagamento
3. **Sistema gera preferência** no Mercado Pago
4. **Cliente é redirecionado** para tela do MP
5. **Cliente paga** usando dados de teste
6. **Mercado Pago retorna** para sua aplicação
7. **Webhook atualiza status** automaticamente

## 📊 Modelos do Banco

### Payment

```python
class Payment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    method = models.CharField(max_length=20)  # 'pix', 'credit_card'
    status = models.CharField(max_length=20)  # 'pendente', 'pago', 'recusado'
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_id = models.CharField(max_length=255, unique=True)
    mercadopago_payment_id = models.CharField(max_length=255, blank=True)
    mercadopago_preference_id = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

## 🔒 Segurança

### Validações Implementadas

- ✅ **Campos protegidos** após pagamento processado
- ✅ **Verificação de propriedade** (usuário só acessa seus pagamentos)
- ✅ **IDs únicos** para evitar duplicatas
- ✅ **Webhook assinado** (validação de origem)
- ✅ **Logs detalhados** para auditoria

### Campos Não Editáveis

Após um pagamento ser processado, estes campos são **read-only**:

- `amount` (valor)
- `transaction_id`
- `mercadopago_payment_id`
- `user` (usuário)
- `order` (pedido)

## 🌐 URLs de Retorno Personalizadas

Para personalizar para onde o usuário retorna após o pagamento:

```python
# Em apps/payments/mercadopago_service.py
"back_urls": {
    "success": f"{base_url}/meu-app/pagamento/sucesso/",
    "failure": f"{base_url}/meu-app/pagamento/falha/",
    "pending": f"{base_url}/meu-app/pagamento/pendente/"
}
```

## 🚀 Deploy para Produção

### 1. Configurar Credenciais de Produção

```env
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-credencial-producao
MERCADO_PAGO_PUBLIC_KEY=APP_USR-public-key-producao
MERCADO_PAGO_SANDBOX=False
```

### 2. Configurar HTTPS

- ✅ Configure certificado SSL
- ✅ Use domínio real nas URLs de retorno
- ✅ Configure CORS se necessário

### 3. Webhook em Produção

O Mercado Pago precisa conseguir acessar:

```
https://seu-dominio.com/v1/payments/webhook/
```

## 📝 Logs e Debug

### Visualizar Logs

```bash
# Logs do container
docker-compose logs web

# Logs em tempo real
docker-compose logs -f web
```

### Logs Importantes

- ✅ **Criação de preferências**
- ✅ **Respostas do Mercado Pago**
- ✅ **Webhooks recebidos**
- ✅ **Atualizações de status**
- ✅ **Erros de validação**

## 🛠️ Comandos Úteis

```bash
# Executar testes
docker-compose exec web python manage.py test apps.payments

# Acessar shell Django
docker-compose exec web python manage.py shell

# Verificar migrações
docker-compose exec web python manage.py showmigrations

# Resetar banco (cuidado!)
docker-compose exec web python manage.py flush
```

## 🆘 Troubleshooting

### Erro: "SDK do Mercado Pago não está instalado"

```bash
docker-compose exec web pip install mercadopago
docker-compose restart web
```

### Erro: "Credenciais não configuradas"

- ✅ Verifique o arquivo `.env`
- ✅ Reinicie os containers
- ✅ Teste as credenciais: `/v1/payments/test-credentials/`

### Erro: "auto_return invalid"

- ✅ URLs de retorno devem ser acessíveis
- ✅ Use ngrok para teste local: `ngrok http 8000`

### Webhook não funciona

- ✅ URL deve ser pública (use ngrok para teste)
- ✅ Verifique logs: `docker-compose logs web`
- ✅ Teste manualmente: `POST /v1/payments/webhook/`

## 📞 Suporte

### Links Úteis

- [Documentação Mercado Pago](https://www.mercadopago.com.br/developers)
- [Cartões de Teste](https://www.mercadopago.com.br/developers/pt/docs/your-integrations/test/cards)
- [Webhook Guide](https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks)

### Status da Integração

- ✅ **Criação de pagamentos**
- ✅ **Checkout Pro**
- ✅ **Webhook funcionando**
- ✅ **Ambiente de teste**
- ✅ **Segurança implementada**
- ✅ **APIs prontas para frontend**

---

**🎉 Sistema 100% funcional e pronto para produção!**
