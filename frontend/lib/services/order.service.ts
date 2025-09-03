import { BaseApiService } from './base-api.service';
import { 
  Order,
  CreateOrderRequest,
  CustomOrder,
  CreateCustomOrderRequest,
  PaginatedResponse
} from '../types';

export class OrderService extends BaseApiService {
  // ===== PEDIDOS =====
  public async getOrders(): Promise<PaginatedResponse<Order>> {
    const response = await this.api.get<PaginatedResponse<Order>>('/api/v1/orders/');
    return response.data;
  }

  public async getOrder(id: number): Promise<Order> {
    const response = await this.api.get<Order>(`/api/v1/orders/${id}/`);
    return response.data;
  }

  public async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    const response = await this.api.post<Order>('/api/v1/orders/', orderData);
    return response.data;
  }

  public async cancelOrder(id: number): Promise<Order> {
    const response = await this.api.patch<Order>(`/api/v1/orders/${id}/cancel/`);
    return response.data;
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
