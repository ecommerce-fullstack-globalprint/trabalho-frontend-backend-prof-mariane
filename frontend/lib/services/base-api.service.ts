import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig
} from 'axios';
import { ApiError, TokenRefreshResponse } from '../types';

export class BaseApiService {
  protected api: AxiosInstance;
  protected readonly baseURL: string;
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
  protected getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  }

  protected getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refresh_token');
    }
    return null;
  }

  protected setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
    }
  }

  protected clearTokens(): void {
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
  protected handleApiError(error: AxiosError): ApiError {
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
}
