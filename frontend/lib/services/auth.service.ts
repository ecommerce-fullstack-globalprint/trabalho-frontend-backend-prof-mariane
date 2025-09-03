import { BaseApiService } from './base-api.service';
import { LocalStorageManager } from './abstractions';
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
    return LocalStorageManager.hasTokens();
  }

  public getCurrentUser(): User | null {
    return LocalStorageManager.getUserData<User>();
  }

  // ===== AUTENTICAÇÃO =====
  public async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/api/v1/auth/login/', credentials);
    
    const { access, refresh, user } = response.data;
    LocalStorageManager.setTokens(access, refresh);
    LocalStorageManager.setUserData(user);
    
    return response.data;
  }

  public async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/api/v1/auth/register/', userData);
    
    const { access, refresh, user } = response.data;
    LocalStorageManager.setTokens(access, refresh);
    LocalStorageManager.setUserData(user);
    
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
    const refreshToken = LocalStorageManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.api.post<TokenRefreshResponse>('/api/v1/auth/token/refresh/', {
      refresh: refreshToken
    });

    LocalStorageManager.setAccessToken(response.data.access);

    return response.data;
  }
}
