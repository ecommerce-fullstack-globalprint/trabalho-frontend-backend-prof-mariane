import { CrudBaseService } from './abstractions';
import { 
  Product,
  ProductFilter,
  PaginatedResponse
} from '../types';

export class ProductService extends CrudBaseService<Product> {
  protected baseEndpoint = '/api/v1/products/';

  // ===== PRODUTOS =====
  public async getProducts(filters?: ProductFilter): Promise<PaginatedResponse<Product>> {
    return this.getAll(filters);
  }

  public async getProduct(id: number): Promise<Product> {
    return this.getById(id);
  }

  public async createProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    return this.create(productData);
  }

  public async updateProduct(id: number, productData: Partial<Product>): Promise<Product> {
    return this.update(id, productData);
  }

  public async deleteProduct(id: number): Promise<void> {
    return this.delete(id);
  }
}
