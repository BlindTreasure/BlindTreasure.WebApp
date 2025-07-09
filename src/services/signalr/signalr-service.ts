import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { getStorageItem } from '@/utils/local-storage';

class SignalRService {
  private connection: HubConnection | null = null;
  private isConnecting = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private connectionUrl = "https://blindtreasureapi.fpt-devteam.fun/hubs/notification";

  async connect(): Promise<void> {
    if (this.connection?.state === 'Connected' || this.isConnecting) {
      console.log('[SignalR] Already connected or connecting, skipping');
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

      // Nếu có connection cũ, đảm bảo nó đã được stop
      if (this.connection) {
        try {
          await this.connection.stop();
          console.log('[SignalR] Stopped previous connection');
        } catch (err) {
          console.warn('[SignalR] Error stopping previous connection', err);
        }
        this.connection = null;
      }

      console.log('[SignalR] Building new connection to', this.connectionUrl);
      
      this.connection = new HubConnectionBuilder()
        .withUrl(this.connectionUrl, {
          accessTokenFactory: () => accessToken
        })
        .withAutomaticReconnect([0, 2000, 5000, 10000, 15000, 30000])
        .configureLogging(LogLevel.Information)
        .build();

      // Xử lý notification nhận được
      this.connection.on('ReceiveNotification', (notification) => {
        console.log('[SignalR] Received notification:', notification);
        // Emit event để các component khác có thể lắng nghe
        window.dispatchEvent(new CustomEvent('notification-received', {
          detail: notification
        }));
      });

      // Xử lý connection events
      this.connection.onclose((error) => {
        console.log('[SignalR] Connection closed:', error);
        this.isConnecting = false;
        this.reconnectAttempts++;
        
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          console.log(`[SignalR] Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
          setTimeout(() => this.connect(), 5000);
        } else {
          console.warn('[SignalR] Max reconnect attempts reached');
        }
      });

      this.connection.onreconnecting((error) => {
        console.log('[SignalR] Reconnecting:', error);
      });

      this.connection.onreconnected((connectionId) => {
        console.log('[SignalR] Reconnected. ConnectionId:', connectionId);
        this.reconnectAttempts = 0;
      });

      console.log('[SignalR] Starting connection...');
      await this.connection.start();
      console.log('[SignalR] Connected successfully');
      this.isConnecting = false;
      this.reconnectAttempts = 0;

    } catch (error) {
      console.error('[SignalR] Connection failed:', error);
      this.isConnecting = false;
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        console.log(`[SignalR] Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
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
        console.log('[SignalR] Disconnected successfully');
      } catch (err) {
        console.error('[SignalR] Error during disconnect:', err);
      } finally {
        this.connection = null;
        this.isConnecting = false;
        this.reconnectAttempts = 0;
      }
    }
  }

  isConnected(): boolean {
    return this.connection?.state === 'Connected';
  }

  getConnectionState(): string {
    return this.connection?.state || 'Disconnected';
  }
}

// Singleton instance
export const signalRService = new SignalRService(); 