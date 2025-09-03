import { BaseApiService } from './base-api.service';
import { 
  Notification,
  PaginatedResponse
} from '../types';

export class NotificationService extends BaseApiService {
  // ===== NOTIFICAÇÕES =====
  public async getNotifications(): Promise<PaginatedResponse<Notification>> {
    const response = await this.api.get<PaginatedResponse<Notification>>('/api/v1/notifications/');
    return response.data;
  }

  public async markNotificationAsRead(id: number): Promise<Notification> {
    const response = await this.api.patch<Notification>(`/api/v1/notifications/${id}/read/`);
    return response.data;
  }

  public async markAllNotificationsAsRead(): Promise<void> {
    await this.api.patch('/api/v1/notifications/mark-all-read/');
  }
}
