// src/services/signalr/notification-signalr.service.ts
import { BaseSignalRService } from '@/utils/BaseSignalRUtils';
import { getStorageItem } from '@/utils/local-storage';

export class UnboxingSignalRService extends BaseSignalRService {
  private static readonly UNBOXING_URL = "https://blindtreasureapi.fpt-devteam.fun/hubs/unboxing";
  private userRole: string | null = null;

  constructor() {
    super(UnboxingSignalRService.UNBOXING_URL);
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
    this.connection.on('ReceiveUnboxingNotification', (notification) => {
      // Filter notifications by user role
      if (notification.targetRole && notification.targetRole !== this.userRole) {
        return;
      }

      this.dispatchEvent('unboxing-notification-received', notification);
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
  onUnboxingReceived(callback: (notification: any) => void): () => void {
    return this.addEventListener('unboxing-notification-received', callback);
  }
}

export const unboxingSignalRService = new UnboxingSignalRService();