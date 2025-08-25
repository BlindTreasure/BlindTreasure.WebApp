// src/services/signalr/signalr-manager.service.ts
import { chatSignalRService } from './feature/chat-service-signalr';
import { notificationSignalRService } from './feature/notification-service-signalr';
import { getStorageItem } from '@/utils/local-storage';

class SignalRManager {
  async connect(): Promise<void> {
    const accessToken = getStorageItem('accessToken');
    if (!accessToken) {
      console.warn('[SignalR Manager] No access token found, skipping connection');
      return;
    }

    try {
      // Connect both services simultaneously
      await Promise.all([
        chatSignalRService.connect(),
        notificationSignalRService.connect()
      ]);
    } catch (error) {
      console.error('[SignalR Manager] Failed to establish connections:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await Promise.all([
        chatSignalRService.disconnect(),
        notificationSignalRService.disconnect()
      ]);
      
      console.log('[SignalR Manager] All connections disconnected');
    } catch (error) {
      console.error('[SignalR Manager] Error during disconnect:', error);
      throw error;
    }
  }

  isConnected(): boolean {
    return chatSignalRService.isConnected() && notificationSignalRService.isConnected();
  }

  getConnectionState(): string {
    const chatState = chatSignalRService.getConnectionState();
    const notificationState = notificationSignalRService.getConnectionState();
    return `Chat: ${chatState}, Notification: ${notificationState}`;
  }

  // Expose individual services for direct access if needed
  get chatService() {
    return chatSignalRService;
  }

  get notificationService() {
    return notificationSignalRService;
  }

  // Backward compatibility methods - delegate to appropriate services
  async sendMessage(receiverId: string, content: string): Promise<void> {
    return chatSignalRService.sendMessage(receiverId, content);
  }

  async sendMessageToAi(prompt: string): Promise<void> {
    return chatSignalRService.sendMessageToAi(prompt);
  }

  async getUserOnlineStatus(userId: string): Promise<void> {
    return chatSignalRService.getUserOnlineStatus(userId);
  }

  async startTyping(receiverId: string): Promise<void> {
    return chatSignalRService.startTyping(receiverId);
  }

  async stopTyping(receiverId: string): Promise<void> {
    return chatSignalRService.stopTyping(receiverId);
  }

  getUserRole(): string | null {
    return notificationSignalRService.getUserRoleValue();
  }

  // Event listeners - delegate to appropriate services
  onMessageReceived(callback: (message: SIGNALR.ReceiveMessage) => void): () => void {
    return chatSignalRService.onMessageReceived(callback);
  }

  onInventoryItemMessageReceived(callback: (message: SIGNALR.ReceiveInventoryItemMessage) => void): () => void {
    return chatSignalRService.onInventoryItemMessageReceived(callback);
  }

  onVideoMessageReceived(callback: (message: SIGNALR.ReceiveMediaMessage) => void): () => void {
    return chatSignalRService.onVideoMessageReceived(callback);
  }

  onImageMessageReceived(callback: (message: SIGNALR.ReceiveMediaMessage) => void): () => void {
    return chatSignalRService.onImageMessageReceived(callback);
  }

  onUserOnline(callback: (message: SIGNALR.UserOnlineStatus) => void): () => void {
    return chatSignalRService.onUserOnline(callback);
  }

  onUserOffline(callback: (message: SIGNALR.UserOnlineStatus) => void): () => void {
    return chatSignalRService.onUserOffline(callback);
  }

  onUserOnlineStatusResponse(callback: (data: { userId: string; isOnline: boolean; timestamp: string }) => void): () => void {
    return chatSignalRService.onUserOnlineStatusResponse(callback);
  }

  onOnlineStatusError(callback: (error: { error: string }) => void): () => void {
    return chatSignalRService.onOnlineStatusError(callback);
  }

  onNotificationReceived(callback: (notification: any) => void): () => void {
    return notificationSignalRService.onNotificationReceived(callback);
  }

  onUnboxingNotificationReceived(callback: (unboxLog: SIGNALR.UnboxLog) => void): () => void {
    return chatSignalRService.onUnboxingNotificationReceived(callback);
  }

  onTradeRequestLocked(callback: (data: any) => void): () => void {
    return notificationSignalRService.onTradeRequestLocked(callback);
  }

  onUnreadCountUpdated(callback: (data: any) => void): () => void {
    return chatSignalRService.onUnreadCountUpdated(callback);
  }

  onUserStartedTyping(callback: (senderId: string) => void): () => void {
    return chatSignalRService.onUserStartedTyping(callback);
  }

  onUserStoppedTyping(callback: (senderId: string) => void): () => void {
    return chatSignalRService.onUserStoppedTyping(callback);
  }
}

export const signalRManager = new SignalRManager();

// For backward compatibility, export the manager as signalRService
export const signalRService = signalRManager;