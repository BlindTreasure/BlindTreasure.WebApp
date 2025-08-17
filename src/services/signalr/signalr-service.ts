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
        
        window.dispatchEvent(new CustomEvent('trade-request-locked', {
          detail: data
        }));
      });

      // CHAT CONNECTION HANDLERS

      // Handle chat messages
      this.chatConnection.on('ReceiveMessage', (message : SIGNALR.ReceiveMessage) => {
        
        window.dispatchEvent(new CustomEvent('message-received', {
          detail: message
        }));
      });

      // Handle inventory item messages
      this.chatConnection.on('ReceiveInventoryItemMessage', (message : SIGNALR.ReceiveInventoryItemMessage) => {
        
        window.dispatchEvent(new CustomEvent('inventory-item-message-received', {
          detail: message
        }));
      });

      // Handle video messages
      this.chatConnection.on('ReceiveVideoMessage', (message : SIGNALR.ReceiveInventoryItemMessage) => {
        
        window.dispatchEvent(new CustomEvent('video-message-received', {
          detail: message
        }));
      });

      // Handle image messages - Updated to dispatch separate event
      this.chatConnection.on('ReceiveImageMessage', (message : SIGNALR.ReceiveInventoryItemMessage) => {
        
        window.dispatchEvent(new CustomEvent('image-message-received', {
          detail: message
        }));
      });

      // Handle unread count updates
      this.chatConnection.on('UnreadCountUpdated', (unreadCount: number) => {
        
        window.dispatchEvent(new CustomEvent('unread-count-updated', {
          detail: unreadCount
        }));
      });

      this.chatConnection.on("UserOnline", (data: SIGNALR.UserOnlineStatus) => {

        window.dispatchEvent(new CustomEvent('user-online', {
          detail: data
        }));
      });

      this.chatConnection.on("UserOffline", (data: SIGNALR.UserOnlineStatus) => {

        window.dispatchEvent(new CustomEvent('user-offline', {
          detail: data
        }));
      });

      // NEW: Handle response from CheckUserOnlineStatus
      this.chatConnection.on("UserOnlineStatus", (data: { userId: string; isOnline: boolean; timestamp: string }) => {
        console.log('[SignalR] Received user online status:', data);
        window.dispatchEvent(new CustomEvent('user-online-status-response', {
          detail: data
        }));
      });

      // Handle online status error
      this.chatConnection.on("OnlineStatusError", (error: { error: string }) => {
        console.error('[SignalR] Online status error:', error);
        window.dispatchEvent(new CustomEvent('online-status-error', {
          detail: error
        }));
      });

      this.chatConnection.on('UserStartedTyping', (senderId: string) => {
        
        window.dispatchEvent(new CustomEvent('user-started-typing', {
          detail: { senderId }
        }));
      });

      // Handle typing stop (UPDATED name from StopTyping to UserStoppedTyping)
      this.chatConnection.on('UserStoppedTyping', (senderId: string) => {
        
        window.dispatchEvent(new CustomEvent('user-stopped-typing', {
          detail: { senderId }
        }));
      });

      this.chatConnection.on('ReceiveUnboxingNotification', (data: SIGNALR.UnboxLog) => {
        
        window.dispatchEvent(new CustomEvent('receive-unboxing-notification', {
          detail: data
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

  // Send message
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

  async getUserOnlineStatus(userId: string): Promise<void> {
    if (!this.chatConnection || this.chatConnection.state !== 'Connected') {
      console.warn('[SignalR] Chat connection not established, cannot get user status');
      return;
    }

    if (!userId) {
      console.warn('[SignalR] User ID is required to get online status');
      return;
    }

    try {
      await this.chatConnection.invoke('CheckUserOnlineStatus', userId);
    } catch (error) {
      console.error('[SignalR] Error getting user online status:', error);
    }
  }

  // Send typing start notification
  async startTyping(receiverId: string): Promise<void> {
    if (!this.chatConnection || this.chatConnection.state !== 'Connected') {
      console.warn('[SignalR] Chat connection not established, cannot send typing notification');
      return;
    }

    try {
      await this.chatConnection.invoke('StartTyping', receiverId);
    } catch (error) {
      console.error('[SignalR] Error sending start typing:', error);
    }
  }

  // Send typing stop notification
  async stopTyping(receiverId: string): Promise<void> {
    if (!this.chatConnection || this.chatConnection.state !== 'Connected') {
      console.warn('[SignalR] Chat connection not established, cannot send typing notification');
      return;
    }

    try {
      await this.chatConnection.invoke('StopTyping', receiverId);
    } catch (error) {
      console.error('[SignalR] Error sending stop typing:', error);
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

  // Event listeners
  onMessageReceived(callback: (message: SIGNALR.ReceiveMessage) => void): () => void {
    const handler = (event: CustomEvent) => {
      callback(event.detail);
    };
    
    window.addEventListener('message-received', handler as EventListener);
    
    return () => {
      window.removeEventListener('message-received', handler as EventListener);
    };
  }

  // Listener for inventory item messages
  onInventoryItemMessageReceived(callback: (message: SIGNALR.ReceiveInventoryItemMessage) => void): () => void {
    const handler = (event: CustomEvent) => {
      callback(event.detail);
    };
    
    window.addEventListener('inventory-item-message-received', handler as EventListener);
    
    return () => {
      window.removeEventListener('inventory-item-message-received', handler as EventListener);
    };
  }

  // Listener for video messages
  onVideoMessageReceived(callback: (message: SIGNALR.ReceiveMediaMessage) => void): () => void {
    const handler = (event: CustomEvent) => {
      callback(event.detail);
    };
    
    window.addEventListener('video-message-received', handler as EventListener);
    
    return () => {
      window.removeEventListener('video-message-received', handler as EventListener);
    };
  }

  // NEW: Listener for image messages
  onImageMessageReceived(callback: (message: SIGNALR.ReceiveMediaMessage) => void): () => void {
    const handler = (event: CustomEvent) => {
      callback(event.detail);
    };
    
    window.addEventListener('image-message-received', handler as EventListener);
    
    return () => {
      window.removeEventListener('image-message-received', handler as EventListener);
    };
  }

  onUserOnline(callback: (message: SIGNALR.UserOnlineStatus) => void): () => void {
    const handler = (event: CustomEvent) => {
      callback(event.detail);
    };
    
    window.addEventListener('user-online', handler as EventListener);
    
    return () => {
      window.removeEventListener('user-online', handler as EventListener);
    };
  }

  onUserOffline(callback: (message: SIGNALR.UserOnlineStatus) => void): () => void {
    const handler = (event: CustomEvent) => {
      callback(event.detail);
    };
    
    window.addEventListener('user-offline', handler as EventListener);
    
    return () => {
      window.removeEventListener('user-offline', handler as EventListener);
    };
  }

  // NEW: Listener for user online status response
  onUserOnlineStatusResponse(callback: (data: { userId: string; isOnline: boolean; timestamp: string }) => void): () => void {
    const handler = (event: CustomEvent) => {
      callback(event.detail);
    };
    
    window.addEventListener('user-online-status-response', handler as EventListener);
    
    return () => {
      window.removeEventListener('user-online-status-response', handler as EventListener);
    };
  }

  // NEW: Listener for online status errors
  onOnlineStatusError(callback: (error: { error: string }) => void): () => void {
    const handler = (event: CustomEvent) => {
      callback(event.detail);
    };
    
    window.addEventListener('online-status-error', handler as EventListener);
    
    return () => {
      window.removeEventListener('online-status-error', handler as EventListener);
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

  onUnboxingNotificationReceived(callback: (unboxLog: SIGNALR.UnboxLog) => void): () => void {
    const handler = (event: CustomEvent) => {
      callback(event.detail);
    };
    
    window.addEventListener('receive-unboxing-notification', handler as EventListener);
    
    return () => {
      window.removeEventListener('receive-unboxing-notification', handler as EventListener);
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

  onUnreadCountUpdated(callback: (data: any) => void): () => void {
    const handler = (event: CustomEvent) => {
      callback(event.detail);
    };
    
    window.addEventListener('unread-count-updated', handler as EventListener);
    
    return () => {
      window.removeEventListener('unread-count-updated', handler as EventListener);
    };
  }

  // Updated typing indicators listeners
  onUserStartedTyping(callback: (senderId: string ) => void): () => void {
    const handler = (event: CustomEvent) => {
      callback(event.detail.senderId);
    };
    
    window.addEventListener('user-started-typing', handler as EventListener);
    
    return () => {
      window.removeEventListener('user-started-typing', handler as EventListener);
    };
  }

  onUserStoppedTyping(callback: (senderId: string ) => void): () => void {
    const handler = (event: CustomEvent) => {
      callback(event.detail.senderId);
    };
    
    window.addEventListener('user-stopped-typing', handler as EventListener);
    
    return () => {
      window.removeEventListener('user-stopped-typing', handler as EventListener);
    };
  }
}

export const signalRService = new SignalRService();