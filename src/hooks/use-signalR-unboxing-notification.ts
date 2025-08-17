import { useEffect, useState, useCallback } from 'react';
import { signalRService } from '@/services/signalr/signalr-service';

// UnboxLog type
type UnboxLog = {
  customerBlindBoxId: string;
  customerName: string;
  productId: string;
  productName: string;
  rarity: string;
  dropRate: number;
  unboxAt: string;
  blindBoxName: string;
}

// Hook return type
interface UseUnboxingNotificationReturn {
  notifications: UnboxLog[];
  latestNotification: UnboxLog | null;
  unreadCount: number;
  isConnected: boolean;
  clearNotifications: () => void;
}

export const useUnboxingNotification = (): UseUnboxingNotificationReturn => {
  const [notifications, setNotifications] = useState<UnboxLog[]>([]);
  const [latestNotification, setLatestNotification] = useState<UnboxLog | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // Handle new unboxing notification
  const handleUnboxingNotification = useCallback((unboxLog: UnboxLog) => {
    // Add to notifications list
    setNotifications(prev => [unboxLog, ...prev.slice(0, 49)]); // Keep only last 50
    setLatestNotification(unboxLog);
    setUnreadCount(prev => prev + 1);

    // Optional: Show browser notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      const message = `${unboxLog.customerName} has unboxed a ${unboxLog.rarity} ${unboxLog.productName} from ${unboxLog.blindBoxName}!`;
      new Notification(`New Unboxing!`, {
        body: message,
        icon: '/default-icon.png',
        tag: `unboxing-${unboxLog.customerBlindBoxId}`
      });
    }
  }, []);

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setLatestNotification(null);
    setUnreadCount(0);
  }, []);

  // Check connection status
  const checkConnectionStatus = useCallback(() => {
    setIsConnected(signalRService.isConnected());
  }, []);

  // Setup SignalR listener and connection checking
  useEffect(() => {
    let unsubscribeUnboxing: (() => void) | undefined;
    let connectionCheckInterval: NodeJS.Timeout;

    const setupSignalR = async () => {
      try {
        // Ensure connection
        if (!signalRService.isConnected()) {
          await signalRService.connect();
        }

        // Subscribe to unboxing notifications
        unsubscribeUnboxing = signalRService.onUnboxingNotificationReceived(handleUnboxingNotification);

        // Initial connection status check
        checkConnectionStatus();

        // Periodic connection status check
        connectionCheckInterval = setInterval(checkConnectionStatus, 5000);
      } catch (error) {
        console.error('[UnboxingHook] Failed to setup SignalR:', error);
        setIsConnected(false);
      }
    };

    setupSignalR();

    // Cleanup function
    return () => {
      if (unsubscribeUnboxing) {
        unsubscribeUnboxing();
      }
      if (connectionCheckInterval) {
        clearInterval(connectionCheckInterval);
      }
    };
  }, [handleUnboxingNotification, checkConnectionStatus]);

  // Request notification permission on mount (optional)
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
      });
    }
  }, []);

  return {
    notifications,
    latestNotification,
    unreadCount,
    isConnected,
    clearNotifications
  };
};