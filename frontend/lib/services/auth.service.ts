import { BaseApiService } from './base-api.service';
import { LocalStorageManager } from './abstractions';
import { AuthResponse, TokenRefreshResponse, User, LoginRequest, RegisterRequest } from '../types';

export class AuthService extends BaseApiService {
  // ===== MÉTODOS UTILITÁRIOS =====
  public isAuthenticated(): boolean {
    return LocalStorageManager.hasTokens(); // Verifica se existe token
  }

  public getCurrentUser(): User | null {
    return LocalStorageManager.getUserData<User>(); // Retorna usuário logado
  }

  // ===== AUTENTICAÇÃO =====
  public async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/api/v1/auth/login/', credentials); // POST login
    
    const { access, refresh, user } = response.data;
    LocalStorageManager.setTokens(access, refresh); // Salva tokens
    LocalStorageManager.setUserData(user);         // Salva dados do usuário
    
    return response.data;
  }

  public async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/api/v1/auth/register/', userData); // POST registro
    
    const { access, refresh, user } = response.data;
    LocalStorageManager.setTokens(access, refresh); // Salva tokens
    LocalStorageManager.setUserData(user);         // Salva dados do usuário
    
    return response.data;
  }

  public async logout(): Promise<void> {
    try {
      const refreshToken = this.getRefreshToken();
      if (refreshToken) {
        await this.api.post('/api/v1/auth/logout/', { refresh: refreshToken }); // Logout no backend
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      this.clearTokens(); // Limpa tokens e dados do usuário
    }
  }

  public async refreshToken(): Promise<TokenRefreshResponse> {
    const refreshToken = LocalStorageManager.getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token available');

    const response = await this.api.post<TokenRefreshResponse>('/api/v1/auth/token/refresh/', {
      refresh: refreshToken
    });

    LocalStorageManager.setAccessToken(response.data.access); // Atualiza token de acesso

    return response.data;
  }
}
