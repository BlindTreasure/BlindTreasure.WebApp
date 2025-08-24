// src/services/signalr/notification-signalr.service.ts
import { BaseSignalRService } from '@/utils/BaseSignalRUtils';
import { getStorageItem } from '@/utils/local-storage';

export class NotificationSignalRService extends BaseSignalRService {
  private static readonly NOTIFICATION_URL = "https://blindtreasureapi.fpt-devteam.fun/hubs/notification";
  private userRole: string | null = null;

  constructor() {
    super(NotificationSignalRService.NOTIFICATION_URL);
  }

  async connect(): Promise<void> {
    // Get user role before connecting
    this.getUserRole();
    await super.connect();
  }

  private getUserRole(): void {
    try {
      const userJson = getStorageItem('persist:root');
      if (userJson) {
        const parsedRoot = JSON.parse(userJson);
        if (parsedRoot.userSlice) {
          const userSlice = JSON.parse(parsedRoot.userSlice);
          if (userSlice.user && userSlice.user.roleName) {
            this.userRole = userSlice.user.roleName;
          }
        }
      }
    } catch (err) {
      console.warn('[SignalR] Could not determine user role:', err);
    }
  }

  protected setupEventHandlers(): void {
    if (!this.connection) return;

    // Handle notification events
    this.connection.on('ReceiveNotification', (notification) => {
      // Filter notifications by user role
      if (notification.targetRole && notification.targetRole !== this.userRole) {
        return;
      }
      
      this.dispatchEvent('notification-received', notification);
    });

    // Handle trade request locked events
    this.connection.on('TradeRequestLocked', (data) => {
      this.dispatchEvent('trade-request-locked', data);
    });
  }

  async disconnect(): Promise<void> {
    await super.disconnect();
    this.userRole = null;
  }

  getUserRoleValue(): string | null {
    return this.userRole;
  }

  // Event listeners
  onNotificationReceived(callback: (notification: any) => void): () => void {
    return this.addEventListener('notification-received', callback);
  }

  onTradeRequestLocked(callback: (data: any) => void): () => void {
    return this.addEventListener('trade-request-locked', callback);
  }
}

export const notificationSignalRService = new NotificationSignalRService();