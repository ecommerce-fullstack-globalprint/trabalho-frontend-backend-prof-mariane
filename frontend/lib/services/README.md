# Estrutura Modular da API

Esta documentação descreve a nova estrutura modular da API, que foi refatorada para melhorar a manutenibilidade e organização do código.

## Estrutura de Arquivos

```
lib/
├── api.ts                    # Arquivo principal (compatibilidade)
├── types.ts                  # Tipos TypeScript
└── services/
    ├── base-api.service.ts   # Serviço base com configuração comum
    ├── auth.service.ts       # Serviços de autenticação
    ├── product.service.ts    # Serviços de produtos
    ├── cart.service.ts       # Serviços do carrinho
    ├── order.service.ts      # Serviços de pedidos
    ├── payment.service.ts    # Serviços de pagamento
    ├── review.service.ts     # Serviços de avaliações
    ├── notification.service.ts # Serviços de notificações
    ├── search.service.ts     # Serviços de busca
    ├── dashboard.service.ts  # Serviços do dashboard
    ├── address.service.ts    # Serviços de endereços
    ├── file-upload.service.ts # Serviços de upload
    ├── index.ts             # Classe principal combinada
    └── services.ts          # Arquivo barril para exports
```

## Como Usar

### Uso Tradicional (Compatibilidade)

```typescript
// Mantém a mesma interface da versão anterior
import apiService from '@/lib/api';

// Métodos de autenticação
const user = await apiService.login(credentials);
const isAuth = apiService.isAuthenticated();

// Métodos de produtos
const products = await apiService.getProducts();
const product = await apiService.getProduct(1);
```

### Uso Modular (Recomendado)

```typescript
// Importação de serviços específicos
import { AuthService, ProductService } from '@/lib/services';

// Uso direto dos serviços
const authService = new AuthService();
const productService = new ProductService();

const user = await authService.login(credentials);
const products = await productService.getProducts();
```

### Uso da Instância Principal

```typescript
import apiService from '@/lib/services';

// Acesso aos serviços através da instância principal
const user = await apiService.auth.login(credentials);
const products = await apiService.products.getProducts();
const cart = await apiService.cart.getCart();
```

## Serviços Disponíveis

### BaseApiService
- Configuração básica do Axios
- Interceptadores de requisição/resposta
- Gerenciamento de tokens
- Tratamento de erros
- Refresh automático de tokens

### AuthService
- `login(credentials)` - Fazer login
- `register(userData)` - Registrar usuário
- `logout()` - Fazer logout
- `refreshToken()` - Renovar token
- `isAuthenticated()` - Verificar autenticação
- `getCurrentUser()` - Obter usuário atual

### ProductService
- `getProducts(filters?)` - Listar produtos
- `getProduct(id)` - Obter produto específico
- `createProduct(data)` - Criar produto
- `updateProduct(id, data)` - Atualizar produto
- `deleteProduct(id)` - Deletar produto

### CartService
- `getCart()` - Obter carrinho
- `addToCart(item)` - Adicionar ao carrinho
- `updateCartItem(id, data)` - Atualizar item
- `removeFromCart(id)` - Remover item
- `clearCart()` - Limpar carrinho

### OrderService
- `getOrders()` - Listar pedidos
- `getOrder(id)` - Obter pedido específico
- `createOrder(data)` - Criar pedido
- `cancelOrder(id)` - Cancelar pedido
- `getCustomOrders()` - Listar pedidos customizados
- `createCustomOrder(data)` - Criar pedido customizado

### PaymentService
- `getPayments()` - Listar pagamentos
- `createPayment(data)` - Criar pagamento
- `getPayment(id)` - Obter pagamento específico

### ReviewService
- `getProductReviews(productId)` - Obter avaliações do produto
- `createReview(data)` - Criar avaliação
- `updateReview(id, data)` - Atualizar avaliação
- `deleteReview(id)` - Deletar avaliação

### NotificationService
- `getNotifications()` - Listar notificações
- `markNotificationAsRead(id)` - Marcar como lida
- `markAllNotificationsAsRead()` - Marcar todas como lidas

### SearchService
- `search(params)` - Buscar conteúdo

### DashboardService
- `getDashboardStats()` - Obter estatísticas do dashboard

### AddressService
- `getAddresses()` - Listar endereços
- `createAddress(data)` - Criar endereço
- `updateAddress(id, data)` - Atualizar endereço
- `deleteAddress(id)` - Deletar endereço

### FileUploadService
- `uploadFile(file, path?)` - Upload de arquivo

## Vantagens da Nova Estrutura

### 1. **Separação de Responsabilidades**
Cada serviço tem uma responsabilidade específica, facilitando a manutenção e testes.

### 2. **Reutilização**
Os serviços podem ser reutilizados em diferentes partes da aplicação.

### 3. **Testabilidade**
Cada serviço pode ser testado individualmente, melhorando a cobertura de testes.

### 4. **Escalabilidade**
Fácil adicionar novos serviços sem afetar os existentes.

### 5. **Compatibilidade**
Mantém a interface original para não quebrar o código existente.

### 6. **Type Safety**
Melhor tipagem TypeScript com interfaces específicas para cada serviço.

## Migração

Para migrar para a nova estrutura:

1. **Substituir importações**:
```typescript
// Antes
import apiService from '@/lib/api';

// Depois
import apiService from '@/lib/services';
// ou
import { AuthService, ProductService } from '@/lib/services';
```

2. **Usar a nova interface modular**:
```typescript
// Antes
apiService.login(credentials);

// Depois (opção 1 - compatibilidade)
apiService.login(credentials);

// Depois (opção 2 - modular)
apiService.auth.login(credentials);

// Depois (opção 3 - instância específica)
const authService = new AuthService();
authService.login(credentials);
```

## Exemplo Prático

```typescript
import apiService from '@/lib/services';

// Exemplo de uso em um componente React
const useAuth = () => {
  const login = async (credentials: LoginRequest) => {
    try {
      const response = await apiService.auth.login(credentials);
      return response;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const logout = async () => {
    await apiService.auth.logout();
  };

  return {
    login,
    logout,
    isAuthenticated: apiService.auth.isAuthenticated(),
    currentUser: apiService.auth.getCurrentUser()
  };
};
```

## Configuração de Ambiente

As variáveis de ambiente continuam as mesmas:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_DEV_MODE=true
```

## Tratamento de Erros

O tratamento de erros é centralizado no `BaseApiService` e inclui:

- Renovação automática de tokens
- Log de erros em desenvolvimento
- Redirecionamento para login em falhas de autenticação
- Formatação padronizada de erros

## Próximos Passos

1. **Implementar testes unitários** para cada serviço
2. **Adicionar interceptadores personalizados** conforme necessário
3. **Criar hooks personalizados** para React Query/SWR
4. **Implementar cache** para otimizar performance
5. **Adicionar métricas** e monitoramento
