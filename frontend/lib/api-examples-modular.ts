// ===== HOOKS PERSONALIZADOS COM A NOVA ESTRUTURA MODULAR =====

import { useEffect, useState } from 'react';
import apiService from '@/lib/services';
import { Product, User, Cart, Order } from '@/lib/types';

// ===== HOOK PARA AUTENTICAÇÃO (NOVA ESTRUTURA) =====
export const useModularAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = apiService.auth.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await apiService.auth.login({ email, password });
      setUser(response.user);
      return response;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await apiService.auth.logout();
      setUser(null);
    } catch (error) {
      console.error('Erro no logout:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setIsLoading(true);
      const response = await apiService.auth.register(userData);
      setUser(response.user);
      return response;
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: apiService.auth.isAuthenticated(),
    login,
    logout,
    register
  };
};

// ===== HOOK PARA PRODUTOS (NOVA ESTRUTURA) =====
export const useModularProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async (filters?: any) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.products.getProducts(filters);
      setProducts(response.results || []);
      return response;
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar produtos');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createProduct = async (productData: any) => {
    try {
      setIsLoading(true);
      const newProduct = await apiService.products.createProduct(productData);
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (err: any) {
      setError(err.message || 'Erro ao criar produto');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProduct = async (id: number, productData: any) => {
    try {
      setIsLoading(true);
      const updatedProduct = await apiService.products.updateProduct(id, productData);
      setProducts(prev => 
        prev.map(product => 
          product.id === id ? updatedProduct : product
        )
      );
      return updatedProduct;
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar produto');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      setIsLoading(true);
      await apiService.products.deleteProduct(id);
      setProducts(prev => prev.filter(product => product.id !== id));
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar produto');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    products,
    isLoading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct
  };
};

// ===== HOOK PARA CARRINHO (NOVA ESTRUTURA) =====
export const useModularCart = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const cartData = await apiService.cart.getCart();
      setCart(cartData);
      return cartData;
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar carrinho');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (item: any) => {
    try {
      setIsLoading(true);
      const updatedCart = await apiService.cart.addToCart(item);
      setCart(updatedCart);
      return updatedCart;
    } catch (err: any) {
      setError(err.message || 'Erro ao adicionar ao carrinho');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCartItem = async (itemId: number, data: any) => {
    try {
      setIsLoading(true);
      const updatedCart = await apiService.cart.updateCartItem(itemId, data);
      setCart(updatedCart);
      return updatedCart;
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar item do carrinho');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (itemId: number) => {
    try {
      setIsLoading(true);
      const updatedCart = await apiService.cart.removeFromCart(itemId);
      setCart(updatedCart);
      return updatedCart;
    } catch (err: any) {
      setError(err.message || 'Erro ao remover item do carrinho');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setIsLoading(true);
      await apiService.cart.clearCart();
      setCart(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao limpar carrinho');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    cart,
    isLoading,
    error,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
  };
};

// ===== HOOK PARA PEDIDOS (NOVA ESTRUTURA) =====
export const useModularOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.orders.getOrders();
      setOrders(response.results || []);
      return response;
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar pedidos');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createOrder = async (orderData: any) => {
    try {
      setIsLoading(true);
      const newOrder = await apiService.orders.createOrder(orderData);
      setOrders(prev => [newOrder, ...prev]);
      return newOrder;
    } catch (err: any) {
      setError(err.message || 'Erro ao criar pedido');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelOrder = async (id: number) => {
    try {
      setIsLoading(true);
      const cancelledOrder = await apiService.orders.cancelOrder(id);
      setOrders(prev => 
        prev.map(order => 
          order.id === id ? cancelledOrder : order
        )
      );
      return cancelledOrder;
    } catch (err: any) {
      setError(err.message || 'Erro ao cancelar pedido');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    orders,
    isLoading,
    error,
    fetchOrders,
    createOrder,
    cancelOrder
  };
};

// ===== EXEMPLOS DE USO DIRETO DOS SERVIÇOS =====

// Exemplo de uso em uma função assíncrona
export const authExample = async () => {
  try {
    // Verificar se está autenticado
    if (!apiService.auth.isAuthenticated()) {
      // Fazer login
      const loginResponse = await apiService.auth.login({
        email: 'user@example.com',
        password: 'password123'
      });
      console.log('Login realizado:', loginResponse.user);
    }

    // Obter usuário atual
    const currentUser = apiService.auth.getCurrentUser();
    console.log('Usuário atual:', currentUser);

  } catch (error) {
    console.error('Erro na autenticação:', error);
  }
};

// Exemplo de busca de produtos
export const productExample = async () => {
  try {
    // Buscar todos os produtos
    const allProducts = await apiService.products.getProducts();
    console.log('Produtos:', allProducts);

    // Buscar produtos com filtros
    const filteredProducts = await apiService.products.getProducts({
      category: 'electronics',
      min_price: 100,
      max_price: 500
    });
    console.log('Produtos filtrados:', filteredProducts);

    // Buscar produto específico
    const product = await apiService.products.getProduct(1);
    console.log('Produto específico:', product);

  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
  }
};

// Exemplo de gerenciamento do carrinho
export const cartExample = async () => {
  try {
    // Obter carrinho atual
    const cart = await apiService.cart.getCart();
    console.log('Carrinho atual:', cart);

    // Adicionar item ao carrinho
    const updatedCart = await apiService.cart.addToCart({
      product_id: 1,
      quantity: 2
    });
    console.log('Carrinho após adição:', updatedCart);

    // Atualizar quantidade de um item
    const cartAfterUpdate = await apiService.cart.updateCartItem(1, {
      quantity: 3
    });
    console.log('Carrinho após atualização:', cartAfterUpdate);

  } catch (error) {
    console.error('Erro no carrinho:', error);
  }
};
