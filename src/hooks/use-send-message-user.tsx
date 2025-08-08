import { useEffect, useCallback, useState } from 'react';
import { signalRService } from '@/services/signalr/signalr-service';

interface ChatMessage {
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
}

interface MessageError {
  error: string;
  details?: string;
}

interface UseChatReturn {
  // State
  isConnected: boolean;
  messages: ChatMessage[];
  error: MessageError | null;
  isLoading: boolean;
  
  // Actions
  sendMessage: (receiverId: string, content: string) => Promise<void>;
  clearMessages: () => void;
  clearError: () => void;
  addMessage: (message: ChatMessage) => void;
  removeMessage: (index: number) => void;
}

export const useChat = (): UseChatReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<MessageError | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Check connection status
  useEffect(() => {
    const checkConnection = () => {
      setIsConnected(signalRService.isConnected());
    };

    // Check initially
    checkConnection();

    // Check periodically
    const interval = setInterval(checkConnection, 1000);

    return () => clearInterval(interval);
  }, []);

  // Listen for incoming messages
  useEffect(() => {
    const unsubscribeMessage = signalRService.onMessageReceived((message: ChatMessage) => {
      console.log('[useChat] Message received:', message);
      setMessages(prev => [...prev, message]);
      setError(null); // Clear any previous errors when message is successfully received
    });

    const unsubscribeError = signalRService.onMessageError((error: MessageError) => {
      console.error('[useChat] Message error:', error);
      setError(error);
      setIsLoading(false);
    });

    return () => {
      unsubscribeMessage();
      unsubscribeError();
    };
  }, []);

  // Send message function
  const sendMessage = useCallback(async (receiverId: string, content: string): Promise<void> => {
    if (!content.trim()) {
      setError({ error: 'Nội dung tin nhắn không được để trống' });
      return;
    }

    if (!receiverId) {
      setError({ error: 'ID người nhận không hợp lệ' });
      return;
    }

    if (!isConnected) {
      setError({ error: 'Chưa kết nối SignalR' });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await signalRService.sendMessage(receiverId, content.trim());
      setIsLoading(false);
    } catch (err: any) {
      console.error('[useChat] Send message error:', err);
      setError({ 
        error: 'Không thể gửi tin nhắn', 
        details: err.message || 'Lỗi không xác định' 
      });
      setIsLoading(false);
    }
  }, [isConnected]);

  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Add message manually (useful for optimistic updates)
  const addMessage = useCallback((message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  }, []);

  // Remove message by index
  const removeMessage = useCallback((index: number) => {
    setMessages(prev => prev.filter((_, i) => i !== index));
  }, []);

  return {
    // State
    isConnected,
    messages,
    error,
    isLoading,
    
    // Actions
    sendMessage,
    clearMessages,
    clearError,
    addMessage,
    removeMessage
  };
};

export default useChat;