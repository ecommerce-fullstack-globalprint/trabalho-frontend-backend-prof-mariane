// ===== HOOKS PERSONALIZADOS =====

import { useEffect, useState } from 'react';
import apiService from '@/lib/api';
import { Product, User, Cart, Order } from '@/lib/types';

// ===== HOOK CUSTOMIZADO PARA AUTENTICAÇÃO =====
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = apiService.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login({ email, password });
      setUser(response.user);
      return response;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
      setUser(null);
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: apiService.isAuthenticated(),
    login,
    logout
  };
};

// ===== HOOK PARA PRODUTOS =====
export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async (filters?: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.getProducts(filters);
      setProducts(response.results);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar produtos');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    products,
    isLoading,
    error,
    fetchProducts
  };
};

// ===== HOOK PARA CARRINHO =====
export const useCart = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const cartData = await apiService.getCart();
      setCart(cartData);
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (productId: number, quantity: number) => {
    try {
      const updatedCart = await apiService.addToCart({ product_id: productId, quantity });
      setCart(updatedCart);
      return updatedCart;
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      throw error;
    }
  };

  const removeFromCart = async (itemId: number) => {
    try {
      const updatedCart = await apiService.removeFromCart(itemId);
      setCart(updatedCart);
      return updatedCart;
    } catch (error) {
      console.error('Erro ao remover do carrinho:', error);
      throw error;
    }
  };

  return {
    cart,
    isLoading,
    fetchCart,
    addToCart,
    removeFromCart
  };
};

// ===== EXEMPLOS DE USO DIRETO DA API =====

// Exemplo: Fazer login
export const loginExample = async () => {
  try {
    const response = await apiService.login({
      email: 'usuario@email.com',
      password: 'senha123'
    });
    console.log('Login realizado:', response.user);
  } catch (error) {
    console.error('Erro no login:', error);
  }
};

// Exemplo: Buscar produtos
export const fetchProductsExample = async () => {
  try {
    const products = await apiService.getProducts({
      category: 'eletrônicos',
      min_price: 100,
      max_price: 500,
      page: 1,
      page_size: 10
    });
    console.log('Produtos encontrados:', products.results);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
  }
};

// Exemplo: Criar pedido
export const createOrderExample = async () => {
  try {
    const order = await apiService.createOrder({
      items: [
        { product_id: 1, quantity: 2 },
        { product_id: 3, quantity: 1 }
      ],
      shipping_address: 'Rua das Flores, 123 - São Paulo, SP',
      payment_method: 'credit_card'
    });
    console.log('Pedido criado:', order);
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
  }
};

// Exemplo: Upload de arquivo
export const uploadFileExample = async (file: File) => {
  try {
    const result = await apiService.uploadFile(file, 'custom-orders');
    console.log('Arquivo enviado:', result.url);
    return result.url;
  } catch (error) {
    console.error('Erro no upload:', error);
    throw error;
  }
};

// ===== UTILITÁRIOS PARA TRATAMENTO DE ERRO =====
export const handleApiError = (error: any) => {
  if (error.status === 401) {
    // Redirecionar para login
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  } else if (error.status === 403) {
    // Mostrar mensagem de acesso negado
    console.error('Acesso negado');
    return 'Acesso negado. Você não tem permissão para esta ação.';
  } else if (error.status >= 500) {
    // Mostrar mensagem de erro do servidor
    console.error('Erro interno do servidor');
    return 'Erro interno do servidor. Tente novamente mais tarde.';
  } else if (error.message) {
    return error.message;
  }
  return 'Erro inesperado. Tente novamente.';
};
