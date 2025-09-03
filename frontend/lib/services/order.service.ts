import { CrudBaseService } from './abstractions';
import { 
  Order,
  CreateOrderRequest,
  CustomOrder,
  CreateCustomOrderRequest,
  PaginatedResponse
} from '../types';

export class OrderService extends CrudBaseService<Order> {
  protected baseEndpoint = '/api/v1/orders/';

  // ===== PEDIDOS =====
  public async getOrders(): Promise<PaginatedResponse<Order>> {
    return this.getAll();
  }

  public async getOrder(id: number): Promise<Order> {
    return this.getById(id);
  }

  public async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    return this.create(orderData);
  }

  public async cancelOrder(id: number): Promise<Order> {
    return this.performAction<Order>(id, 'cancel', {}, 'PATCH');
  }

  // ===== PEDIDOS CUSTOMIZADOS =====
  public async getCustomOrders(): Promise<PaginatedResponse<CustomOrder>> {
    const response = await this.api.get<PaginatedResponse<CustomOrder>>('/api/v1/custom-orders/');
    return response.data;
  }

  public async getCustomOrder(id: number): Promise<CustomOrder> {
    const response = await this.api.get<CustomOrder>(`/api/v1/custom-orders/${id}/`);
    return response.data;
  }

  public async createCustomOrder(orderData: CreateCustomOrderRequest): Promise<CustomOrder> {
    const formData = new FormData();
    formData.append('title', orderData.title);
    formData.append('description', orderData.description);
    formData.append('budget_min', orderData.budget_min.toString());
    formData.append('budget_max', orderData.budget_max.toString());
    formData.append('deadline', orderData.deadline);

    if (orderData.attachments) {
      orderData.attachments.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file);
      });
    }

    const response = await this.api.post<CustomOrder>('/api/v1/custom-orders/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}
