import axios, { 
  AxiosInstance, 
  AxiosRequestConfig, 
  AxiosResponse, 
  AxiosError,
  InternalAxiosRequestConfig
} from 'axios';
import { 
  ApiResponse, 
  ApiError, 
  AuthResponse, 
  TokenRefreshResponse,
  User,
  LoginRequest,
  RegisterRequest,
  Product,
  ProductFilter,
  PaginatedResponse,
  Cart,
  AddToCartRequest,
  UpdateCartItemRequest,
  Order,
  CreateOrderRequest,
  CustomOrder,
  CreateCustomOrderRequest,
  Payment,
  PaymentRequest,
  Review,
  CreateReviewRequest,
  Notification,
  DashboardStats,
  SearchParams,
  SearchResult,
  Address,
  CreateAddressRequest
} from './types';

// ===== CONFIGURAÇÃO DA API =====
class ApiService {
  private api: AxiosInstance;
  private readonly baseURL: string;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  // ===== CONFIGURAÇÃO DOS INTERCEPTADORES =====
  private setupInterceptors(): void {
    // Interceptador de requisição
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getAccessToken();
        
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Log da requisição em desenvolvimento
        if (process.env.NEXT_PUBLIC_DEV_MODE === 'true') {
          console.log(`🚀 [API] ${config.method?.toUpperCase()} ${config.url}`, {
            data: config.data,
            params: config.params
          });
        }

        return config;
      },
      (error: AxiosError) => {
        console.error('❌ [API] Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Interceptador de resposta
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log da resposta em desenvolvimento
        if (process.env.NEXT_PUBLIC_DEV_MODE === 'true') {
          console.log(`✅ [API] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
            status: response.status,
            data: response.data
          });
        }

        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Se o erro for 401 e não for uma tentativa de refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshAccessToken();
            
            if (newToken && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            // Se o refresh falhar, redirecionar para login
            this.handleAuthFailure();
            return Promise.reject(refreshError);
          }
        }

        // Log do erro
        console.error('❌ [API] Response Error:', {
          status: error.response?.status,
          message: error.response?.data,
          url: error.config?.url
        });

        return Promise.reject(this.handleApiError(error));
      }
    );
  }

  // ===== GERENCIAMENTO DE TOKENS =====
  private getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  }

  private getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refresh_token');
    }
    return null;
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
    }
  }

  private clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
    }
  }

  private async refreshAccessToken(): Promise<string | null> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    this.refreshPromise = this.performTokenRefresh(refreshToken);
    
    try {
      const newToken = await this.refreshPromise;
      return newToken;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async performTokenRefresh(refreshToken: string): Promise<string> {
    try {
      const response = await axios.post(`${this.baseURL}/api/v1/auth/token/refresh/`, {
        refresh: refreshToken
      });

      const { access } = response.data as TokenRefreshResponse;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', access);
      }

      return access;
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  }

  private handleAuthFailure(): void {
    this.clearTokens();
    // Redirecionar para login ou emitir evento
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  // ===== TRATAMENTO DE ERROS =====
  private handleApiError(error: AxiosError): ApiError {
    const apiError: ApiError = {
      message: 'Erro inesperado',
      status: error.response?.status || 500
    };

    if (error.response?.data) {
      const errorData = error.response.data as any;
      
      if (errorData.detail) {
        apiError.detail = errorData.detail;
      }
      
      if (errorData.message) {
        apiError.message = errorData.message;
      }
      
      if (errorData.errors) {
        apiError.errors = errorData.errors;
      }

      if (errorData.code) {
        apiError.code = errorData.code;
      }
    } else if (error.request) {
      apiError.message = 'Erro de conexão com o servidor';
    }

    return apiError;
  }

  // ===== MÉTODOS UTILITÁRIOS =====
  public isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  public getCurrentUser(): User | null {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  // ===== AUTENTICAÇÃO =====
  public async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/api/v1/auth/login/', credentials);
    
    const { access, refresh, user } = response.data;
    this.setTokens(access, refresh);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_data', JSON.stringify(user));
    }
    
    return response.data;
  }

  public async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/api/v1/auth/register/', userData);
    
    const { access, refresh, user } = response.data;
    this.setTokens(access, refresh);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_data', JSON.stringify(user));
    }
    
    return response.data;
  }

  public async logout(): Promise<void> {
    try {
      const refreshToken = this.getRefreshToken();
      if (refreshToken) {
        await this.api.post('/api/v1/auth/logout/', { refresh: refreshToken });
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      this.clearTokens();
    }
  }

  public async refreshToken(): Promise<TokenRefreshResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.api.post<TokenRefreshResponse>('/api/v1/auth/token/refresh/', {
      refresh: refreshToken
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', response.data.access);
    }

    return response.data;
  }

  // ===== PRODUTOS =====
  public async getProducts(filters?: ProductFilter): Promise<PaginatedResponse<Product>> {
    const response = await this.api.get<PaginatedResponse<Product>>('/api/v1/products/', {
      params: filters
    });
    return response.data;
  }

  public async getProduct(id: number): Promise<Product> {
    const response = await this.api.get<Product>(`/api/v1/products/${id}/`);
    return response.data;
  }

  public async createProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const response = await this.api.post<Product>('/api/v1/products/', productData);
    return response.data;
  }

  public async updateProduct(id: number, productData: Partial<Product>): Promise<Product> {
    const response = await this.api.patch<Product>(`/api/v1/products/${id}/`, productData);
    return response.data;
  }

  public async deleteProduct(id: number): Promise<void> {
    await this.api.delete(`/api/v1/products/${id}/`);
  }

  // ===== CARRINHO =====
  public async getCart(): Promise<Cart> {
    const response = await this.api.get<Cart>('/api/v1/cart/');
    return response.data;
  }

  public async addToCart(item: AddToCartRequest): Promise<Cart> {
    const response = await this.api.post<Cart>('/api/v1/cart/add/', item);
    return response.data;
  }

  public async updateCartItem(itemId: number, data: UpdateCartItemRequest): Promise<Cart> {
    const response = await this.api.patch<Cart>(`/api/v1/cart/items/${itemId}/`, data);
    return response.data;
  }

  public async removeFromCart(itemId: number): Promise<Cart> {
    const response = await this.api.delete<Cart>(`/api/v1/cart/items/${itemId}/`);
    return response.data;
  }

  public async clearCart(): Promise<void> {
    await this.api.delete('/api/v1/cart/clear/');
  }

  // ===== PEDIDOS =====
  public async getOrders(): Promise<PaginatedResponse<Order>> {
    const response = await this.api.get<PaginatedResponse<Order>>('/api/v1/orders/');
    return response.data;
  }

  public async getOrder(id: number): Promise<Order> {
    const response = await this.api.get<Order>(`/api/v1/orders/${id}/`);
    return response.data;
  }

  public async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    const response = await this.api.post<Order>('/api/v1/orders/', orderData);
    return response.data;
  }

  public async cancelOrder(id: number): Promise<Order> {
    const response = await this.api.patch<Order>(`/api/v1/orders/${id}/cancel/`);
    return response.data;
  }

  // ===== PEDIDOS CUSTOMIZADOS =====
  public async getCustomOrders(): Promise<PaginatedResponse<CustomOrder>> {
    const response = await this.api.get<PaginatedResponse<CustomOrder>>('/api/v1/custom-orders/');
    return response.data;
  }

  public async getCustomOrder(id: number): Promise<CustomOrder> {
    const response = await this.api.get<CustomOrder>(`/api/v1/custom-orders/${id}/`);
    return response.data;
  }

  public async createCustomOrder(orderData: CreateCustomOrderRequest): Promise<CustomOrder> {
    const formData = new FormData();
    formData.append('title', orderData.title);
    formData.append('description', orderData.description);
    formData.append('budget_min', orderData.budget_min.toString());
    formData.append('budget_max', orderData.budget_max.toString());
    formData.append('deadline', orderData.deadline);

    if (orderData.attachments) {
      orderData.attachments.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file);
      });
    }

    const response = await this.api.post<CustomOrder>('/api/v1/custom-orders/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // ===== PAGAMENTOS =====
  public async getPayments(): Promise<PaginatedResponse<Payment>> {
    const response = await this.api.get<PaginatedResponse<Payment>>('/api/v1/payments/');
    return response.data;
  }

  public async createPayment(paymentData: PaymentRequest): Promise<Payment> {
    const response = await this.api.post<Payment>('/api/v1/payments/', paymentData);
    return response.data;
  }

  public async getPayment(id: number): Promise<Payment> {
    const response = await this.api.get<Payment>(`/api/v1/payments/${id}/`);
    return response.data;
  }

  // ===== AVALIAÇÕES =====
  public async getProductReviews(productId: number): Promise<PaginatedResponse<Review>> {
    const response = await this.api.get<PaginatedResponse<Review>>(`/api/v1/products/${productId}/reviews/`);
    return response.data;
  }

  public async createReview(reviewData: CreateReviewRequest): Promise<Review> {
    const response = await this.api.post<Review>('/api/v1/reviews/', reviewData);
    return response.data;
  }

  public async updateReview(id: number, reviewData: Partial<CreateReviewRequest>): Promise<Review> {
    const response = await this.api.patch<Review>(`/api/v1/reviews/${id}/`, reviewData);
    return response.data;
  }

  public async deleteReview(id: number): Promise<void> {
    await this.api.delete(`/api/v1/reviews/${id}/`);
  }

  // ===== NOTIFICAÇÕES =====
  public async getNotifications(): Promise<PaginatedResponse<Notification>> {
    const response = await this.api.get<PaginatedResponse<Notification>>('/api/v1/notifications/');
    return response.data;
  }

  public async markNotificationAsRead(id: number): Promise<Notification> {
    const response = await this.api.patch<Notification>(`/api/v1/notifications/${id}/read/`);
    return response.data;
  }

  public async markAllNotificationsAsRead(): Promise<void> {
    await this.api.patch('/api/v1/notifications/mark-all-read/');
  }

  // ===== BUSCA =====
  public async search(params: SearchParams): Promise<SearchResult> {
    const response = await this.api.get<SearchResult>('/api/v1/search/', {
      params
    });
    return response.data;
  }

  // ===== DASHBOARD =====
  public async getDashboardStats(): Promise<DashboardStats> {
    const response = await this.api.get<DashboardStats>('/api/v1/dashboard/stats/');
    return response.data;
  }

  // ===== ENDEREÇOS =====
  public async getAddresses(): Promise<Address[]> {
    const response = await this.api.get<Address[]>('/api/v1/addresses/');
    return response.data;
  }

  public async createAddress(addressData: CreateAddressRequest): Promise<Address> {
    const response = await this.api.post<Address>('/api/v1/addresses/', addressData);
    return response.data;
  }

  public async updateAddress(id: number, addressData: Partial<CreateAddressRequest>): Promise<Address> {
    const response = await this.api.patch<Address>(`/api/v1/addresses/${id}/`, addressData);
    return response.data;
  }

  public async deleteAddress(id: number): Promise<void> {
    await this.api.delete(`/api/v1/addresses/${id}/`);
  }

  // ===== UPLOAD DE ARQUIVOS =====
  public async uploadFile(file: File, path?: string): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    if (path) {
      formData.append('path', path);
    }

    const response = await this.api.post<{ url: string }>('/api/v1/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

// ===== INSTÂNCIA SINGLETON =====
const apiService = new ApiService();
export default apiService;

// ===== EXPORTS NOMEADOS =====
export { ApiService };
export type { AxiosError as ApiRequestError };
