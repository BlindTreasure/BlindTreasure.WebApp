import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { getStorageItem } from '@/utils/local-storage';

class SignalRService {
  private notificationConnection: HubConnection | null = null;
  private chatConnection: HubConnection | null = null;
  private isConnecting = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private notificationConnectionUrl = "https://blindtreasureapi.fpt-devteam.fun/hubs/notification";
  private chatConnectionUrl = "https://blindtreasureapi.fpt-devteam.fun/hubs/chat";
  private userRole: string | null = null;

  async connect(): Promise<void> {
    if ((this.notificationConnection?.state === 'Connected' && this.chatConnection?.state === 'Connected') || this.isConnecting) {
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

      // Get user role from localStorage
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

      // Stop existing connections if any
      if (this.notificationConnection) {
        try {
          await this.notificationConnection.stop();
        } catch (err) {
          console.warn('[SignalR] Error stopping previous notification connection', err);
        }
        this.notificationConnection = null;
      }

      if (this.chatConnection) {
        try {
          await this.chatConnection.stop();
        } catch (err) {
          console.warn('[SignalR] Error stopping previous chat connection', err);
        }
        this.chatConnection = null;
      }

      // Initialize notification connection
      this.notificationConnection = new HubConnectionBuilder()
        .withUrl(this.notificationConnectionUrl, {
          accessTokenFactory: () => accessToken,
          skipNegotiation: false,
          withCredentials: false
        })
        .withAutomaticReconnect([0, 2000, 5000, 10000, 15000, 30000])
        .configureLogging(LogLevel.Information)
        .build();

      // Initialize chat connection
      this.chatConnection = new HubConnectionBuilder()
        .withUrl(this.chatConnectionUrl, {
          accessTokenFactory: () => accessToken,
          skipNegotiation: false,
          withCredentials: false
        })
        .withAutomaticReconnect([0, 2000, 5000, 10000, 15000, 30000])
        .configureLogging(LogLevel.Information)
        .build();

      // Handle notification events
      this.notificationConnection.on('ReceiveNotification', (notification) => {
        if (notification.targetRole && notification.targetRole !== this.userRole) {
          return;
        }
        
        window.dispatchEvent(new CustomEvent('notification-received', {
          detail: notification
        }));
      });

      // Handle trade request locked events
      this.notificationConnection.on('TradeRequestLocked', (data) => {
        console.log('[SignalR] TradeRequestLocked received:', data);
        
        window.dispatchEvent(new CustomEvent('trade-request-locked', {
          detail: data
        }));
      });

      // Handle chat events
      this.chatConnection.on('ReceiveMessage', (message) => {
        console.log('[SignalR] ReceiveMessage:', message);
        
        window.dispatchEvent(new CustomEvent('message-received', {
          detail: message
        }));
      });

      this.chatConnection.on('MessageError', (error) => {
        console.error('[SignalR] MessageError:', error);
        
        window.dispatchEvent(new CustomEvent('message-error', {
          detail: error
        }));
      });

      // Handle connection events for both connections
      const handleConnectionClose = (connection: HubConnection, type: string) => {
        connection.onclose((error) => {
          this.isConnecting = false;
          this.reconnectAttempts++;
          
          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            setTimeout(() => this.connect(), 5000);
          } else {
            console.warn(`[SignalR] Max reconnect attempts reached for ${type} connection`);
          }
        });

        connection.onreconnecting((error) => {
          console.log(`[SignalR] Reconnecting ${type}...`);
        });

        connection.onreconnected((connectionId) => {
          console.log(`[SignalR] Reconnected ${type} with ID:`, connectionId);
          this.reconnectAttempts = 0;
        });
      };

      handleConnectionClose(this.notificationConnection, 'notification');
      handleConnectionClose(this.chatConnection, 'chat');

      // Start both connections
      await Promise.all([
        this.notificationConnection.start(),
        this.chatConnection.start()
      ]);
      
      console.log('[SignalR] Both connections established successfully');
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

  async sendMessage(receiverId: string, content: string): Promise<void> {
    if (!this.chatConnection || this.chatConnection.state !== 'Connected') {
      throw new Error('SignalR chat connection is not established');
    }

    if (!receiverId || !content.trim()) {
      throw new Error('Receiver ID and content are required');
    }

    try {
      await this.chatConnection.invoke('SendMessage', receiverId, content.trim());
    } catch (error) {
      console.error('[SignalR] Error sending message:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await Promise.all([
        this.notificationConnection?.stop(),
        this.chatConnection?.stop()
      ]);
    } catch (err) {
      console.error('[SignalR] Error during disconnect:', err);
    } finally {
      this.notificationConnection = null;
      this.chatConnection = null;
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      this.userRole = null;
    }
  }

  isConnected(): boolean {
    return this.notificationConnection?.state === 'Connected' && this.chatConnection?.state === 'Connected';
  }

  getConnectionState(): string {
    const notificationState = this.notificationConnection?.state || 'Disconnected';
    const chatState = this.chatConnection?.state || 'Disconnected';
    return `Notification: ${notificationState}, Chat: ${chatState}`;
  }
  
  getUserRole(): string | null {
    return this.userRole;
  }

  onMessageReceived(callback: (message: any) => void): () => void {
    const handler = (event: CustomEvent) => {
      callback(event.detail);
    };
    
    window.addEventListener('message-received', handler as EventListener);
    
    return () => {
      window.removeEventListener('message-received', handler as EventListener);
    };
  }

  onMessageError(callback: (error: any) => void): () => void {
    const handler = (event: CustomEvent) => {
      callback(event.detail);
    };
    
    window.addEventListener('message-error', handler as EventListener);
    
    return () => {
      window.removeEventListener('message-error', handler as EventListener);
    };
  }

  onNotificationReceived(callback: (notification: any) => void): () => void {
    const handler = (event: CustomEvent) => {
      callback(event.detail);
    };
    
    window.addEventListener('notification-received', handler as EventListener);
    
    return () => {
      window.removeEventListener('notification-received', handler as EventListener);
    };
  }

  onTradeRequestLocked(callback: (data: any) => void): () => void {
    const handler = (event: CustomEvent) => {
      callback(event.detail);
    };
    
    window.addEventListener('trade-request-locked', handler as EventListener);
    
    return () => {
      window.removeEventListener('trade-request-locked', handler as EventListener);
    };
  }
}

export const signalRService = new SignalRService();