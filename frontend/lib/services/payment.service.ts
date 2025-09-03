import { CrudBaseService } from './abstractions';
import { 
  Payment,
  PaymentRequest,
  PaginatedResponse
} from '../types';

export class PaymentService extends CrudBaseService<Payment> {
  protected baseEndpoint = '/api/v1/payments/';

  // ===== PAGAMENTOS =====
  public async getPayments(): Promise<PaginatedResponse<Payment>> {
    return this.getAll();
  }

  public async createPayment(paymentData: PaymentRequest): Promise<Payment> {
    // Não usa abstração devido a incompatibilidade de tipos:
    // PaymentRequest.amount: number vs Payment.amount: string
    const response = await this.api.post<Payment>(this.baseEndpoint, paymentData);
    return response.data;
  }

  public async getPayment(id: number): Promise<Payment> {
    return this.getById(id);
  }
}
