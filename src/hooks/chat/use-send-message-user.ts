import { useEffect, useCallback, useState, useRef } from 'react';
import { signalRService } from '@/services/signalr/signalr-service';

// User status interfaces
export interface UserStatus {
  isOnline: boolean;
}

export interface TypingStatus {
  isTyping: boolean;
}

interface UseChatReturn {
  // State
  isConnected: boolean;
  message?: SIGNALR.ReceiveMessage;
  mediaMessage?: SIGNALR.ReceiveMediaMessage
  inventoryItemMessage?:  SIGNALR.ReceiveInventoryItemMessage
  userStatuses: Record<string, UserStatus>;
  typingUsers: Record<string, TypingStatus>;
  
  // Actions
  sendMessage: (receiverId: string, content: string) => Promise<void>;
  startTyping: (receiverId: string) => Promise<void>;
  stopTyping: (receiverId: string) => Promise<void>;
  clearMessages: () => void;
  clearTypingForUser: (receiverId: string) => Promise<void>;
  checkUserOnlineStatus: (userId: string) => Promise<void>;
  
  // Helpers
  isUserOnline: (userId: string) => boolean;
}

export const useChat = (): UseChatReturn => {
  const [message, setMessage] = useState<SIGNALR.ReceiveMessage>();
  const [mediaMessage, setMediaMessage] = useState<SIGNALR.ReceiveMediaMessage>();
  const [inventoryItemMessage, setInventoryItemMessage] = useState<SIGNALR.ReceiveInventoryItemMessage>();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [userStatuses, setUserStatuses] = useState<Record<string, UserStatus>>({});
  const [typingUsers, setTypingUsers] = useState<Record<string, TypingStatus>>({});
  
  // Typing timeout refs
  const typingTimeouts = useRef<Record<string, NodeJS.Timeout>>({});
  const typingStatusTimeouts = useRef<Record<string, NodeJS.Timeout>>({});
  
  // Track current typing state để tránh duplicate calls
  const currentTypingUsers = useRef<Set<string>>(new Set());

  // Cleanup function để gọi stopTyping cho tất cả active typing users
  const cleanupTyping = useCallback(async () => {
    const typingPromises = Array.from(currentTypingUsers.current).map(async (receiverId) => {
      try {
        if (signalRService.isConnected()) {
          await signalRService.stopTyping(receiverId);
        }
      } catch (error) {
        console.error('[useChat] Cleanup typing error for user:', receiverId, error);
      }
    });
    
    await Promise.allSettled(typingPromises);
    currentTypingUsers.current.clear();
    
    // Clear all timeouts
    Object.values(typingTimeouts.current).forEach(clearTimeout);
    Object.values(typingStatusTimeouts.current).forEach(clearTimeout);
    
    typingTimeouts.current = {};
    typingStatusTimeouts.current = {};
  }, []);

  // Check connection status
  useEffect(() => {
    const checkConnection = () => {
      setIsConnected(signalRService.isConnected());
    };

    checkConnection();
    const interval = setInterval(checkConnection, 1000);

    return () => clearInterval(interval);
  }, []);

  // Listen for incoming text messages (ReceiveMessage)
  useEffect(() => {
    const unsubscribeMessage = signalRService.onMessageReceived((message: SIGNALR.ReceiveMessage) => {
      setMessage(message);
    });

    return () => {
      unsubscribeMessage();
    };
  }, []);

  // Listen for incoming video messages (ReceiveVideoMessage)
  useEffect(() => {
    const unsubscribeVideoMessage = signalRService.onVideoMessageReceived((message: SIGNALR.ReceiveMediaMessage) => {
      setMediaMessage(message);
    });

    return () => {
      unsubscribeVideoMessage();
    };
  }, []);

  // Listen for incoming image messages (ReceiveImageMessage)
  useEffect(() => {
    const unsubscribeImageMessage = signalRService.onImageMessageReceived((message: SIGNALR.ReceiveMediaMessage) => {
      setMediaMessage(message);
    });

    return () => {
      unsubscribeImageMessage();
    };
  }, []);

  // Listen for incoming inventory item messages (ReceiveInventoryItemMessage)
  useEffect(() => {
    const unsubscribeInventoryMessage = signalRService.onInventoryItemMessageReceived((message: SIGNALR.ReceiveInventoryItemMessage) => {
      setInventoryItemMessage(message);
    });

    return () => {
      unsubscribeInventoryMessage();
    };
  }, []);

  // Listen for user online/offline status
  useEffect(() => {
    const unsubscribeOnline = signalRService.onUserOnline((data: SIGNALR.UserOnlineStatus) => {
      setUserStatuses(prev => ({
        ...prev,
        [data.userId]: {
          isOnline: true,
        }
      }));
    });

    const unsubscribeOffline = signalRService.onUserOffline((data: SIGNALR.UserOnlineStatus) => {
      setUserStatuses(prev => ({
        ...prev,
        [data.userId]: {
          isOnline: false,
        }
      }));
    });

    return () => {
      unsubscribeOnline();
      unsubscribeOffline();
    };
  }, []);

  // Listen for user online status response (from CheckUserOnlineStatus)
  useEffect(() => {
    const unsubscribeStatusResponse = signalRService.onUserOnlineStatusResponse((data: { userId: string; isOnline: boolean; timestamp: string }) => {
      
      setUserStatuses(prev => ({
        ...prev,
        [data.userId]: {
          isOnline: data.isOnline,
        }
      }));
    });

    const unsubscribeStatusError = signalRService.onOnlineStatusError((error: { error: string }) => {
      console.error('[useChat] Online status check error:', error.error);
    });

    return () => {
      unsubscribeStatusResponse();
      unsubscribeStatusError();
    };
  }, []);

  // Listen for user started typing
  useEffect(() => {
    const unsubscribeStartedTyping = signalRService.onUserStartedTyping((senderId: string) => {
      setTypingUsers(prev => ({
        ...prev,
        [senderId]: {
          isTyping: true
        }
      }));

      // Clear any existing timeout for this user
      if (typingStatusTimeouts.current[senderId]) {
        clearTimeout(typingStatusTimeouts.current[senderId]);
      }

      // Auto-remove typing status after 10 seconds if no StopTyping received
      typingStatusTimeouts.current[senderId] = setTimeout(() => {
        setTypingUsers(prev => {
          const newState = { ...prev };
          delete newState[senderId];
          return newState;
        });
        delete typingStatusTimeouts.current[senderId];
      }, 10000);
    });

    return () => {
      unsubscribeStartedTyping();
    };
  }, []);

  // Listen for user stopped typing
  useEffect(() => {
    const unsubscribeStoppedTyping = signalRService.onUserStoppedTyping((senderId: string) => {
      // Clear timeout if exists
      if (typingStatusTimeouts.current[senderId]) {
        clearTimeout(typingStatusTimeouts.current[senderId]);
        delete typingStatusTimeouts.current[senderId];
      }

      setTypingUsers(prev => {
        const newState = { ...prev };
        delete newState[senderId];
        return newState;
      });
    });

    return () => {
      unsubscribeStoppedTyping();
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupTyping();
    };
  }, [cleanupTyping]);

  // Send message function
  const sendMessage = useCallback(async (receiverId: string, content: string): Promise<void> => {
    if (!content.trim()) {
      throw new Error('Nội dung tin nhắn không được để trống');
    }

    if (!receiverId) {
      throw new Error('ID người nhận không hợp lệ');
    }

    if (!isConnected) {
      throw new Error('Chưa kết nối SignalR');
    }

    try {
      // Clear typing before sending message
      await stopTyping(receiverId);
      
      await signalRService.sendMessage(receiverId, content.trim());
    } catch (err: any) {
      console.error('[useChat] Send message error:', err);
      throw new Error(err.message || 'Không thể gửi tin nhắn');
    }
  }, [isConnected]);

  // Improved startTyping với debounce
  const startTyping = useCallback(async (receiverId: string): Promise<void> => {
    if (!receiverId || !isConnected) return;

    try {
      // Clear existing timeout for this receiver
      if (typingTimeouts.current[receiverId]) {
        clearTimeout(typingTimeouts.current[receiverId]);
      }

      // Chỉ gọi signalR nếu chưa đang typing với user này
      if (!currentTypingUsers.current.has(receiverId)) {
        await signalRService.startTyping(receiverId);
        currentTypingUsers.current.add(receiverId);
      }

      // Auto-stop typing after 3 seconds of no activity
      typingTimeouts.current[receiverId] = setTimeout(async () => {
        try {
          if (signalRService.isConnected()) {
            await signalRService.stopTyping(receiverId);
          }
          currentTypingUsers.current.delete(receiverId);
        } catch (error) {
          console.error('[useChat] Auto stop typing error:', error);
        } finally {
          delete typingTimeouts.current[receiverId];
        }
      }, 3000);
      
    } catch (error) {
      console.error('[useChat] Start typing error:', error);
      // Remove from tracking nếu có lỗi
      currentTypingUsers.current.delete(receiverId);
    }
  }, [isConnected]);

  // Improved stopTyping
  const stopTyping = useCallback(async (receiverId: string): Promise<void> => {
    if (!receiverId || !isConnected) return;

    try {
      // Clear timeout if exists
      if (typingTimeouts.current[receiverId]) {
        clearTimeout(typingTimeouts.current[receiverId]);
        delete typingTimeouts.current[receiverId];
      }

      // Chỉ gọi signalR nếu đang typing với user này
      if (currentTypingUsers.current.has(receiverId)) {
        await signalRService.stopTyping(receiverId);
        currentTypingUsers.current.delete(receiverId);
      }
    } catch (error) {
      console.error('[useChat] Stop typing error:', error);
      // Vẫn remove khỏi tracking dù có lỗi
      currentTypingUsers.current.delete(receiverId);
    }
  }, [isConnected]);

  // Clear typing for specific user (useful when send message)
  const clearTypingForUser = useCallback(async (receiverId: string): Promise<void> => {
    await stopTyping(receiverId);
  }, [stopTyping]);

  // Check user online status function
  const checkUserOnlineStatus = useCallback(async (userId: string): Promise<void> => {
    if (!userId || !isConnected) {
      console.warn('[useChat] Cannot check user status - invalid userId or not connected');
      return;
    }

    try {
      await signalRService.getUserOnlineStatus(userId);
    } catch (error) {
      console.error('[useChat] Error checking user online status:', error);
    }
  }, [isConnected]);

  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessage(undefined);
    setMediaMessage(undefined);
    setInventoryItemMessage(undefined);
  }, []);

  // Helper functions
  const isUserOnline = useCallback((userId: string): boolean => {
    return userStatuses[userId]?.isOnline ?? false;
  }, [userStatuses]);

  return {
    // State
    isConnected,
    message,
    mediaMessage,
    inventoryItemMessage,
    userStatuses,
    typingUsers,
    
    // Actions
    sendMessage,
    startTyping,
    stopTyping,
    clearMessages,
    clearTypingForUser,
    checkUserOnlineStatus,
    
    // Helpers
    isUserOnline,
  };
};

export default useChat;