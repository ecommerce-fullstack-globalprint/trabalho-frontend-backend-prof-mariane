import { BaseApiService } from './base-api.service';
import { 
  Product,
  ProductFilter,
  PaginatedResponse
} from '../types';

export class ProductService extends BaseApiService {
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
}
