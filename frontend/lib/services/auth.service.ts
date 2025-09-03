import { BaseApiService } from './base-api.service';
import { 
  AuthResponse, 
  TokenRefreshResponse,
  User,
  LoginRequest,
  RegisterRequest
} from '../types';

export class AuthService extends BaseApiService {
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
}
