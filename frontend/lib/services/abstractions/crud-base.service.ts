import { BaseApiService } from '../base-api.service';
import { PaginatedResponse } from '../../types';

/**
 * Classe abstrata que implementa operações CRUD padrão
 * para reduzir repetição de código nos serviços
 */
export abstract class CrudBaseService<T> extends BaseApiService {
  protected abstract baseEndpoint: string;

  /**
   * Busca todos os recursos com filtros opcionais
   */
  protected async getAll(filters?: Record<string, any>): Promise<PaginatedResponse<T>> {
    const response = await this.api.get<PaginatedResponse<T>>(this.baseEndpoint, {
      params: filters
    });
    return response.data;
  }

  /**
   * Busca um recurso específico por ID
   */
  protected async getById(id: number): Promise<T> {
    const response = await this.api.get<T>(`${this.baseEndpoint}${id}/`);
    return response.data;
  }

  /**
   * Cria um novo recurso
   */
  protected async create(data: Partial<T>): Promise<T> {
    const response = await this.api.post<T>(this.baseEndpoint, data);
    return response.data;
  }

  /**
   * Atualiza um recurso existente (PATCH)
   */
  protected async update(id: number, data: Partial<T>): Promise<T> {
    const response = await this.api.patch<T>(`${this.baseEndpoint}${id}/`, data);
    return response.data;
  }

  /**
   * Substitui um recurso existente (PUT)
   */
  protected async replace(id: number, data: Partial<T>): Promise<T> {
    const response = await this.api.put<T>(`${this.baseEndpoint}${id}/`, data);
    return response.data;
  }

  /**
   * Remove um recurso
   */
  protected async delete(id: number): Promise<void> {
    await this.api.delete(`${this.baseEndpoint}${id}/`);
  }

  /**
   * Executa uma ação personalizada em um recurso específico
   */
  protected async performAction<U = T>(
    id: number, 
    action: string, 
    data?: any, 
    method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE' = 'POST'
  ): Promise<U> {
    const url = `${this.baseEndpoint}${id}/${action}/`;
    
    switch (method) {
      case 'GET':
        const getResponse = await this.api.get<U>(url, { params: data });
        return getResponse.data;
      case 'POST':
        const postResponse = await this.api.post<U>(url, data);
        return postResponse.data;
      case 'PATCH':
        const patchResponse = await this.api.patch<U>(url, data);
        return patchResponse.data;
      case 'PUT':
        const putResponse = await this.api.put<U>(url, data);
        return putResponse.data;
      case 'DELETE':
        await this.api.delete(url);
        return {} as U;
      default:
        throw new Error(`Método HTTP não suportado: ${method}`);
    }
  }

  /**
   * Executa uma ação em toda a coleção
   */
  protected async performCollectionAction<U = any>(
    action: string,
    data?: any,
    method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE' = 'POST'
  ): Promise<U> {
    const url = `${this.baseEndpoint}${action}/`;
    
    switch (method) {
      case 'GET':
        const getResponse = await this.api.get<U>(url, { params: data });
        return getResponse.data;
      case 'POST':
        const postResponse = await this.api.post<U>(url, data);
        return postResponse.data;
      case 'PATCH':
        const patchResponse = await this.api.patch<U>(url, data);
        return patchResponse.data;
      case 'PUT':
        const putResponse = await this.api.put<U>(url, data);
        return putResponse.data;
      case 'DELETE':
        await this.api.delete(url);
        return {} as U;
      default:
        throw new Error(`Método HTTP não suportado: ${method}`);
    }
  }
}
