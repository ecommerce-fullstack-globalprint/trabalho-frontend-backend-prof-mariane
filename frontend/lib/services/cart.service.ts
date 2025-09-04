import { CrudBaseService } from './abstractions';
import { Cart, AddToCartRequest, UpdateCartItemRequest } from '../types';

export class CartService extends CrudBaseService<Cart> {
  protected baseEndpoint = '/api/v1/cart/'; // Endpoint base do carrinho

  // ===== CARRINHO =====
  public async getCart(): Promise<Cart> {
    const response = await this.api.get<Cart>(this.baseEndpoint); // GET carrinho
    return response.data; // Retorna dados do carrinho
  }

  public async addToCart(item: AddToCartRequest): Promise<Cart> {
    return this.performCollectionAction<Cart>('add', item); // Adiciona item usando método genérico
  }

  public async updateCartItem(itemId: number, data: UpdateCartItemRequest): Promise<Cart> {
    const response = await this.api.patch<Cart>(`${this.baseEndpoint}items/${itemId}/`, data); // Atualiza item específico
    return response.data;
  }

  public async removeFromCart(itemId: number): Promise<Cart> {
    const response = await this.api.delete<Cart>(`${this.baseEndpoint}items/${itemId}/`); // Remove item específico
    return response.data;
  }

  public async clearCart(): Promise<void> {
    await this.performCollectionAction('clear', {}, 'DELETE'); // Limpa todo o carrinho
  }
}
