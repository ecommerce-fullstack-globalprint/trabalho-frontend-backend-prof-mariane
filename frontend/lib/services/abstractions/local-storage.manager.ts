/**
 * Classe utilitária para gerenciar localStorage de forma centralizada
 * Abstrai a lógica repetitiva de autenticação
 */
export class LocalStorageManager {
  // ===== CONSTANTES =====
  private static readonly ACCESS_TOKEN_KEY = 'access_token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private static readonly USER_DATA_KEY = 'user_data';

  // ===== VERIFICAÇÃO DE AMBIENTE =====
  private static isClient(): boolean {
    return typeof window !== 'undefined';
  }

  // ===== TOKENS =====
  public static getAccessToken(): string | null {
    if (!this.isClient()) return null;
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  public static getRefreshToken(): string | null {
    if (!this.isClient()) return null;
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  public static setTokens(accessToken: string, refreshToken: string): void {
    if (!this.isClient()) return;
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  public static setAccessToken(accessToken: string): void {
    if (!this.isClient()) return;
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
  }

  public static setRefreshToken(refreshToken: string): void {
    if (!this.isClient()) return;
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  public static clearTokens(): void {
    if (!this.isClient()) return;
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_DATA_KEY);
  }

  // ===== DADOS DO USUÁRIO =====
  public static getUserData<T = any>(): T | null {
    if (!this.isClient()) return null;
    
    const userData = localStorage.getItem(this.USER_DATA_KEY);
    if (!userData) return null;
    
    try {
      return JSON.parse(userData) as T;
    } catch (error) {
      console.error('Erro ao fazer parse dos dados do usuário:', error);
      return null;
    }
  }

  public static setUserData<T = any>(userData: T): void {
    if (!this.isClient()) return;
    localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData));
  }

  public static clearUserData(): void {
    if (!this.isClient()) return;
    localStorage.removeItem(this.USER_DATA_KEY);
  }

  // ===== MÉTODOS GENÉRICOS =====
  public static getItem(key: string): string | null {
    if (!this.isClient()) return null;
    return localStorage.getItem(key);
  }

  public static setItem(key: string, value: string): void {
    if (!this.isClient()) return;
    localStorage.setItem(key, value);
  }

  public static removeItem(key: string): void {
    if (!this.isClient()) return;
    localStorage.removeItem(key);
  }

  public static getObject<T = any>(key: string): T | null {
    if (!this.isClient()) return null;
    
    const item = localStorage.getItem(key);
    if (!item) return null;
    
    try {
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Erro ao fazer parse do objeto ${key}:`, error);
      return null;
    }
  }

  public static setObject<T = any>(key: string, value: T): void {
    if (!this.isClient()) return;
    localStorage.setItem(key, JSON.stringify(value));
  }

  // ===== LIMPEZA COMPLETA =====
  public static clearAll(): void {
    if (!this.isClient()) return;
    localStorage.clear();
  }

  // ===== VERIFICAÇÕES =====
  public static hasTokens(): boolean {
    return !!(this.getAccessToken() && this.getRefreshToken());
  }

  public static hasValidUserData(): boolean {
    const userData = this.getUserData();
    return userData !== null && typeof userData === 'object';
  }
}
