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
    return this.create(paymentData);
  }

  public async getPayment(id: number): Promise<Payment> {
    return this.getById(id);
  }
}
