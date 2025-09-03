import { CrudBaseService } from './abstractions';
import { 
  Notification,
  PaginatedResponse
} from '../types';

export class NotificationService extends CrudBaseService<Notification> {
  protected baseEndpoint = '/api/v1/notifications/';

  // ===== NOTIFICAÇÕES =====
  public async getNotifications(): Promise<PaginatedResponse<Notification>> {
    return this.getAll();
  }

  public async markNotificationAsRead(id: number): Promise<Notification> {
    return this.performAction<Notification>(id, 'read', {}, 'PATCH');
  }

  public async markAllNotificationsAsRead(): Promise<void> {
    await this.performCollectionAction('mark-all-read', {}, 'PATCH');
  }
}
