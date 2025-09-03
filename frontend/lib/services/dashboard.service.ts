import { BaseApiService } from './base-api.service';
import { 
  DashboardStats
} from '../types';

export class DashboardService extends BaseApiService {
  // ===== DASHBOARD =====
  public async getDashboardStats(): Promise<DashboardStats> {
    const response = await this.api.get<DashboardStats>('/api/v1/dashboard/stats/');
    return response.data;
  }
}
