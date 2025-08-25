import { useEffect, useCallback, useState } from 'react';
import { signalRService } from '@/services/signalr/signalr-service';

interface UseAiChatReturn {
  // State
  isConnected: boolean;
  message?: SIGNALR.ReceiveMessage;
  
  // Actions
  sendMessageToAi: (prompt: string) => Promise<void>;
  clearMessage: () => void;
}

export const useAiChat = (): UseAiChatReturn => {
  const [message, setMessage] = useState<SIGNALR.ReceiveMessage>();
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // Check connection status
  useEffect(() => {
    const checkConnection = () => {
      setIsConnected(signalRService.isConnected());
    };

    checkConnection();
    const interval = setInterval(checkConnection, 1000);

    return () => clearInterval(interval);
  }, []);

  // Listen for incoming messages (both user and AI messages)
  useEffect(() => {
    const unsubscribeMessage = signalRService.onMessageReceived((message: SIGNALR.ReceiveMessage) => {
      if (message.senderId === "AI" || message.receiverId === "AI") {
        setMessage(message);
      }
    });

    return () => {
      unsubscribeMessage();
    };
  }, []);

  // Send message to AI function
  const sendMessageToAi = useCallback(async (prompt: string): Promise<void> => {
    if (!prompt.trim()) {
      throw new Error('Nội dung tin nhắn không được để trống');
    }

    if (!isConnected) {
      throw new Error('Chưa kết nối SignalR');
    }

    try {
      await signalRService.sendMessageToAi(prompt.trim());
    } catch (err: any) {
      console.error('[useAiChat] Send message to AI error:', err);
      throw new Error(err.message || 'Không thể gửi tin nhắn tới AI');
    }
  }, [isConnected]);

  // Clear message
  const clearMessage = useCallback(() => {
    setMessage(undefined);
  }, []);

  return {
    // State
    isConnected,
    message,
    
    // Actions
    sendMessageToAi,
    clearMessage,
  };
};

export default useAiChat;