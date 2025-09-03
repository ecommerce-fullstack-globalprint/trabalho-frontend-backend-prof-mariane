# 🚀 Integração Frontend-Backend API

Esta documentação explica como usar a infraestrutura de comunicação entre o frontend e backend que foi configurada.

## 📁 Estrutura dos Arquivos

```
frontend/
├── lib/
│   ├── api.ts           # Serviço principal da API
│   ├── types.ts         # Definições TypeScript
│   └── api-examples.ts  # Exemplos de uso
├── .env.local          # Variáveis de ambiente
└── next.config.mjs     # Configuração do Next.js
```

## ⚙️ Configuração

### 1. Variáveis de Ambiente (.env.local)

```env
# URL base da API
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Versão da API
NEXT_PUBLIC_API_VERSION=v1

# Configurações de desenvolvimento
NEXT_PUBLIC_DEV_MODE=true
NEXT_PUBLIC_LOG_LEVEL=debug
```

### 2. Dependências Instaladas

- **axios**: Para requisições HTTP
- Interceptadores configurados para autenticação automática
- Tratamento de erros centralizado
- Renovação automática de tokens

## 🔧 Funcionalidades Implementadas

### ✅ Autenticação
- Login/Register automático
- Renovação de tokens JWT
- Interceptadores para headers de autenticação
- Logout seguro

### ✅ Entidades Suportadas
- **Usuários**: Login, registro, perfil
- **Produtos**: CRUD completo, filtros, busca
- **Carrinho**: Adicionar, remover, atualizar itens
- **Pedidos**: Criar, visualizar, cancelar
- **Pedidos Customizados**: Com upload de arquivos
- **Pagamentos**: Integração com métodos de pagamento
- **Avaliações**: Sistema de reviews
- **Notificações**: Gerenciamento centralizado
- **Endereços**: CRUD de endereços de entrega

### ✅ Recursos Avançados
- **Upload de arquivos** com FormData
- **Paginação** automática
- **Busca avançada** com filtros
- **Dashboard** com estatísticas
- **Tratamento de erros** robusto

## 📖 Como Usar

### 1. Importar o Serviço

```typescript
import apiService from '@/lib/api';
import { Product, User, Order } from '@/lib/types';
```

### 2. Autenticação

```typescript
// Login
const response = await apiService.login({
  email: 'usuario@email.com',
  password: 'senha123'
});

// Verificar se está autenticado
if (apiService.isAuthenticated()) {
  const user = apiService.getCurrentUser();
}

// Logout
await apiService.logout();
```

### 3. Produtos

```typescript
// Buscar produtos com filtros
const products = await apiService.getProducts({
  category: 'eletrônicos',
  min_price: 100,
  max_price: 500,
  search: 'smartphone',
  page: 1,
  page_size: 10
});

// Buscar produto específico
const product = await apiService.getProduct(1);
```

### 4. Carrinho

```typescript
// Adicionar ao carrinho
await apiService.addToCart({
  product_id: 1,
  quantity: 2
});

// Obter carrinho atual
const cart = await apiService.getCart();

// Remover item do carrinho
await apiService.removeFromCart(itemId);
```

### 5. Pedidos

```typescript
// Criar pedido
const order = await apiService.createOrder({
  items: [
    { product_id: 1, quantity: 2 },
    { product_id: 3, quantity: 1 }
  ],
  shipping_address: 'Rua das Flores, 123',
  payment_method: 'credit_card'
});

// Listar pedidos
const orders = await apiService.getOrders();
```

## 🎯 Hooks Personalizados

### useAuth
```typescript
const { user, isAuthenticated, login, logout } = useAuth();
```

### useProducts
```typescript
const { products, isLoading, error, fetchProducts } = useProducts();
```

### useCart
```typescript
const { cart, addToCart, removeFromCart } = useCart();
```

## 🛡️ Tratamento de Erros

O serviço inclui tratamento automático de erros:

- **401 (Não autorizado)**: Renovação automática de token
- **403 (Proibido)**: Redirecionamento para login
- **500+ (Erro servidor)**: Log e notificação do usuário
- **Timeout**: Configuração personalizável

## 🔄 Interceptadores

### Requisições
- Adiciona automaticamente o token JWT
- Logs detalhados em modo desenvolvimento
- Headers padrão configurados

### Respostas
- Renovação automática de tokens expirados
- Tratamento centralizado de erros
- Logs de debugging

## 📝 Tipos TypeScript

Todas as entidades possuem tipos TypeScript completos:

```typescript
interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  // ... mais campos
}

interface Order {
  id: number;
  status: OrderStatus;
  total_amount: string;
  // ... mais campos
}
```

## 🚀 Próximos Passos

1. **Configurar o backend** para aceitar as requisições
2. **Implementar middleware** de autenticação
3. **Configurar CORS** adequadamente
4. **Testar todas as rotas** da API
5. **Implementar cache** para melhor performance

## 🔧 Configuração do Backend

Certifique-se de que seu backend Django está configurado com:

- **CORS** habilitado para o frontend
- **JWT Authentication** configurado
- **Endpoints** correspondentes aos métodos da API
- **Serializers** para todas as entidades
- **Permissions** adequadas

## 📚 Recursos Adicionais

- Consulte `lib/api-examples.ts` para exemplos práticos
- Todos os tipos estão em `lib/types.ts`
- Logs detalhados disponíveis no console do navegador
- Configurações personalizáveis em `.env.local`

---

✨ **A integração está pronta para uso!** Agora você pode começar a desenvolver suas páginas frontend utilizando toda a infraestrutura de comunicação com o backend.
