'use client';

// Exemplo de componente React usando a API
import React, { useEffect } from 'react';
import { useAuth, useProducts, useCart } from '@/lib/api-examples';

// ===== COMPONENTE DE LISTA DE PRODUTOS =====
export const ProductList = () => {
  const { products, isLoading, error, fetchProducts } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, []);

  if (isLoading) return <div>Carregando produtos...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <div key={product.id} className="border rounded-lg p-4">
          <h3 className="font-semibold">{product.name}</h3>
          <p className="text-gray-600">{product.description}</p>
          <p className="text-lg font-bold">R$ {product.price}</p>
        </div>
      ))}
    </div>
  );
};

// ===== COMPONENTE DE AUTENTICAÇÃO =====
export const AuthButton = () => {
  const { user, isAuthenticated, login, logout } = useAuth();

  const handleLogin = async () => {
    try {
      await login('usuario@email.com', 'senha123');
    } catch (error) {
      console.error('Erro no login:', error);
    }
  };

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-4">
        <span>Olá, {user.first_name}!</span>
        <button 
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={handleLogin}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Login
    </button>
  );
};

// ===== COMPONENTE DE CARRINHO =====
export const CartWidget = () => {
  const { cart, addToCart, removeFromCart, fetchCart } = useCart();

  useEffect(() => {
    fetchCart();
  }, []);

  const handleAddToCart = async (productId: number) => {
    try {
      await addToCart(productId, 1);
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-semibold mb-2">Carrinho</h3>
      {cart && cart.items.length > 0 ? (
        <div>
          <div className="space-y-2">
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <span>{item.product.name}</span>
                <div className="flex items-center gap-2">
                  <span>R$ {item.subtotal}</span>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 text-sm"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-2 border-t">
            <strong>Total: R$ {cart.total_price}</strong>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Carrinho vazio</p>
      )}
    </div>
  );
};

// ===== COMPONENTE DE TRATAMENTO DE ERRO GLOBAL =====
export const ApiErrorHandler = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Interceptar erros globais da API
    const handleApiError = (error: any) => {
      if (error.status === 401) {
        // Redirecionar para login
        window.location.href = '/login';
      } else if (error.status === 403) {
        // Mostrar mensagem de acesso negado
        console.error('Acesso negado');
      } else if (error.status >= 500) {
        // Mostrar mensagem de erro do servidor
        console.error('Erro interno do servidor');
      }
    };

    // Aqui você pode adicionar listeners para erros globais
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason?.status) {
        handleApiError(event.reason);
      }
    });

    return () => {
      window.removeEventListener('unhandledrejection', () => {});
    };
  }, []);

  return <>{children}</>;
};

// ===== PÁGINA DE EXEMPLO COMPLETA =====
export const ExamplePage = () => {
  return (
    <ApiErrorHandler>
      <div className="container mx-auto p-4">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Loja Online</h1>
            <AuthButton />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-semibold mb-4">Produtos</h2>
            <ProductList />
          </div>
          
          <div className="lg:col-span-1">
            <CartWidget />
          </div>
        </div>
      </div>
    </ApiErrorHandler>
  );
};
