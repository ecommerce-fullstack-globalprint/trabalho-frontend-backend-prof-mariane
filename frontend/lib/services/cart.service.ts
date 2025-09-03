import { BaseApiService } from './base-api.service';
import { 
  Cart,
  AddToCartRequest,
  UpdateCartItemRequest
} from '../types';

export class CartService extends BaseApiService {
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
}
