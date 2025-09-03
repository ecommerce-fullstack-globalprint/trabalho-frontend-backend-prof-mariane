import { BaseApiService } from './base-api.service';
import { 
  Payment,
  PaymentRequest,
  PaginatedResponse
} from '../types';

export class PaymentService extends BaseApiService {
  // ===== PAGAMENTOS =====
  public async getPayments(): Promise<PaginatedResponse<Payment>> {
    const response = await this.api.get<PaginatedResponse<Payment>>('/api/v1/payments/');
    return response.data;
  }

  public async createPayment(paymentData: PaymentRequest): Promise<Payment> {
    const response = await this.api.post<Payment>('/api/v1/payments/', paymentData);
    return response.data;
  }

  public async getPayment(id: number): Promise<Payment> {
    const response = await this.api.get<Payment>(`/api/v1/payments/${id}/`);
    return response.data;
  }
}
