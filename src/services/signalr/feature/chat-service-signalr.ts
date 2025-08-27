// src/services/signalr/chat-signalr.service.ts
import { BaseSignalRService } from '@/utils/BaseSignalRUtils';

export class ChatSignalRService extends BaseSignalRService {
  private static readonly CHAT_URL = "https://blindtreasureapi.fpt-devteam.fun/hubs/chat";

  constructor() {
    super(ChatSignalRService.CHAT_URL);
  }

  protected setupEventHandlers(): void {
    if (!this.connection) return;

    // Handle chat messages
    this.connection.on('ReceiveMessage', (message: SIGNALR.ReceiveMessage) => {
      this.dispatchEvent('message-received', message);
    });

    // Handle inventory item messages
    this.connection.on('ReceiveInventoryItemMessage', (message: SIGNALR.ReceiveInventoryItemMessage) => {
      this.dispatchEvent('inventory-item-message-received', message);
    });

    // Handle video messages
    this.connection.on('ReceiveVideoMessage', (message: SIGNALR.ReceiveInventoryItemMessage) => {
      this.dispatchEvent('video-message-received', message);
    });

    // Handle image messages
    this.connection.on('ReceiveImageMessage', (message: SIGNALR.ReceiveInventoryItemMessage) => {
      this.dispatchEvent('image-message-received', message);
    });

    // Handle unread count updates
    this.connection.on('UnreadCountUpdated', (unreadCount: number) => {
      this.dispatchEvent('unread-count-updated', unreadCount);
    });

    // Handle user online/offline status
    this.connection.on("UserOnline", (data: SIGNALR.UserOnlineStatus) => {
      this.dispatchEvent('user-online', data);
    });

    this.connection.on("UserOffline", (data: SIGNALR.UserOnlineStatus) => {
      this.dispatchEvent('user-offline', data);
    });

    // Handle response from CheckUserOnlineStatus
    this.connection.on("UserOnlineStatus", (data: { userId: string; isOnline: boolean; timestamp: string }) => {
      this.dispatchEvent('user-online-status-response', data);
    });

    // Handle online status error
    this.connection.on("OnlineStatusError", (error: { error: string }) => {
      this.dispatchEvent('online-status-error', error);
    });

    // Handle typing indicators
    this.connection.on('UserStartedTyping', (senderId: string) => {
      this.dispatchEvent('user-started-typing', { senderId });
    });

    this.connection.on('UserStoppedTyping', (senderId: string) => {
      this.dispatchEvent('user-stopped-typing', { senderId });
    });

    // Handle unboxing notifications
    this.connection.on('ReceiveUnboxingNotification', (data: SIGNALR.UnboxLog) => {
      this.dispatchEvent('receive-unboxing-notification', data);
    });
  }

  // Send message
  async sendMessage(receiverId: string, content: string): Promise<void> {
    if (!this.connection || this.connection.state !== 'Connected') {
      throw new Error('SignalR chat connection is not established');
    }

    if (!receiverId || !content.trim()) {
      throw new Error('Receiver ID and content are required');
    }

    try {
      await this.connection.invoke('SendMessage', receiverId, content.trim());
    } catch (error) {
      throw error;
    }
  }

  // Send message to AI
  async sendMessageToAi(prompt: string): Promise<void> {
    if (!this.connection || this.connection.state !== 'Connected') {
      throw new Error('SignalR chat connection is not established');
    }

    if (!prompt.trim()) {
      throw new Error('Prompt are required');
    }

    try {
      await this.connection.invoke('SendMessageToAi', prompt.trim());
    } catch (error) {
      throw error;
    }
  }

  // Get user online status
  async getUserOnlineStatus(userId: string): Promise<void> {
    if (!this.connection || this.connection.state !== 'Connected') {
      return;
    }

    if (!userId) {
      return;
    }

    try {
      await this.connection.invoke('CheckUserOnlineStatus', userId);
    } catch (error) {
    }
  }

  // Send typing start notification
  async startTyping(receiverId: string): Promise<void> {
    if (!this.connection || this.connection.state !== 'Connected') {
      return;
    }

    try {
      await this.connection.invoke('StartTyping', receiverId);
    } catch (error) {
    }
  }

  // Send typing stop notification
  async stopTyping(receiverId: string): Promise<void> {
    if (!this.connection || this.connection.state !== 'Connected') {
      return;
    }

    try {
      await this.connection.invoke('StopTyping', receiverId);
    } catch (error) {
    }
  }

  // Event listeners
  onMessageReceived(callback: (message: SIGNALR.ReceiveMessage) => void): () => void {
    return this.addEventListener('message-received', callback);
  }

  onInventoryItemMessageReceived(callback: (message: SIGNALR.ReceiveInventoryItemMessage) => void): () => void {
    return this.addEventListener('inventory-item-message-received', callback);
  }

  onVideoMessageReceived(callback: (message: SIGNALR.ReceiveMediaMessage) => void): () => void {
    return this.addEventListener('video-message-received', callback);
  }

  onImageMessageReceived(callback: (message: SIGNALR.ReceiveMediaMessage) => void): () => void {
    return this.addEventListener('image-message-received', callback);
  }

  onUserOnline(callback: (message: SIGNALR.UserOnlineStatus) => void): () => void {
    return this.addEventListener('user-online', callback);
  }

  onUserOffline(callback: (message: SIGNALR.UserOnlineStatus) => void): () => void {
    return this.addEventListener('user-offline', callback);
  }

  onUserOnlineStatusResponse(callback: (data: { userId: string; isOnline: boolean; timestamp: string }) => void): () => void {
    return this.addEventListener('user-online-status-response', callback);
  }

  onOnlineStatusError(callback: (error: { error: string }) => void): () => void {
    return this.addEventListener('online-status-error', callback);
  }

  onUnreadCountUpdated(callback: (data: any) => void): () => void {
    return this.addEventListener('unread-count-updated', callback);
  }

  onUserStartedTyping(callback: (senderId: string) => void): () => void {
    return this.addEventListener('user-started-typing', (data: { senderId: string }) => {
      callback(data.senderId);
    });
  }

  onUserStoppedTyping(callback: (senderId: string) => void): () => void {
    return this.addEventListener('user-stopped-typing', (data: { senderId: string }) => {
      callback(data.senderId);
    });
  }
}

export const chatSignalRService = new ChatSignalRService();