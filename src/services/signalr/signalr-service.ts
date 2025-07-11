import { HubConnection, HubConnectionBuilder, LogLevel, HttpTransportType } from '@microsoft/signalr';
import { getStorageItem } from '@/utils/local-storage';

class SignalRService {
  private connection: HubConnection | null = null;
  private isConnecting = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private connectionUrl = "https://blindtreasureapi.fpt-devteam.fun/hubs/notification";
  private userRole: string | null = null;

  async connect(): Promise<void> {
    if (this.connection?.state === 'Connected' || this.isConnecting) {
      return;
    }

    this.isConnecting = true;

    try {
      const accessToken = getStorageItem('accessToken');
      if (!accessToken) {
        console.warn('[SignalR] No access token found, skipping connection');
        this.isConnecting = false;
        return;
      }

      // Lấy thông tin role từ user trong localStorage
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

      // Nếu có connection cũ, đảm bảo nó đã được stop
      if (this.connection) {
        try {
          await this.connection.stop();
        } catch (err) {
          console.warn('[SignalR] Error stopping previous connection', err);
        }
        this.connection = null;
      }
      
      this.connection = new HubConnectionBuilder()
        .withUrl(this.connectionUrl, {
          accessTokenFactory: () => accessToken,
          skipNegotiation: false,
          withCredentials: false
        })
        .withAutomaticReconnect([0, 2000, 5000, 10000, 15000, 30000])
        .configureLogging(LogLevel.Information)
        .build();

      // Xử lý notification nhận được
      this.connection.on('ReceiveNotification', (notification) => {
        
        // Kiểm tra nếu notification có targetRole và không khớp với role hiện tại thì bỏ qua
        if (notification.targetRole && notification.targetRole !== this.userRole) {
          return;
        }
        
        // Emit event để các component khác có thể lắng nghe
        window.dispatchEvent(new CustomEvent('notification-received', {
          detail: notification
        }));
      });

      // Xử lý connection events
      this.connection.onclose((error) => {
        this.isConnecting = false;
        this.reconnectAttempts++;
        
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          setTimeout(() => this.connect(), 5000);
        } else {
          console.warn('[SignalR] Max reconnect attempts reached');
        }
      });

      this.connection.onreconnecting((error) => {
      });

      this.connection.onreconnected((connectionId) => {
        this.reconnectAttempts = 0;
      });

      await this.connection.start();
      this.isConnecting = false;
      this.reconnectAttempts = 0;

    } catch (error) {
      console.error('[SignalR] Connection failed:', error);
      this.isConnecting = false;
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        setTimeout(() => this.connect(), 5000);
      } else {
        console.warn('[SignalR] Max reconnect attempts reached');
      }
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.stop();
      } catch (err) {
        console.error('[SignalR] Error during disconnect:', err);
      } finally {
        this.connection = null;
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.userRole = null;
      }
    }
  }

  isConnected(): boolean {
    return this.connection?.state === 'Connected';
  }

  getConnectionState(): string {
    return this.connection?.state || 'Disconnected';
  }
  
  getUserRole(): string | null {
    return this.userRole;
  }
}

// Singleton instance
export const signalRService = new SignalRService(); 