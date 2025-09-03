import { CrudBaseService } from './abstractions';
import { 
  Cart,
  AddToCartRequest,
  UpdateCartItemRequest
} from '../types';

export class CartService extends CrudBaseService<Cart> {
  protected baseEndpoint = '/api/v1/cart/';

  // ===== CARRINHO =====
  public async getCart(): Promise<Cart> {
    const response = await this.api.get<Cart>(this.baseEndpoint);
    return response.data;
  }

  public async addToCart(item: AddToCartRequest): Promise<Cart> {
    return this.performCollectionAction<Cart>('add', item);
  }

  public async updateCartItem(itemId: number, data: UpdateCartItemRequest): Promise<Cart> {
    const response = await this.api.patch<Cart>(`${this.baseEndpoint}items/${itemId}/`, data);
    return response.data;
  }

  public async removeFromCart(itemId: number): Promise<Cart> {
    const response = await this.api.delete<Cart>(`${this.baseEndpoint}items/${itemId}/`);
    return response.data;
  }

  public async clearCart(): Promise<void> {
    await this.performCollectionAction('clear', {}, 'DELETE');
  }
}
