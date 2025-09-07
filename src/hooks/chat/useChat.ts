import { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/stores/store';
import { useChat } from '@/hooks/chat/use-send-message-user';
import { useServiceMarkMessageAsRead } from '@/services/chat/services';
import useSendImageUser from '@/hooks/chat/use-send-image-user';
import useSendInventoryItemUser from '@/hooks/chat/use-send-inventory-item-to-user';
import useGetNewChatConversation from '@/hooks/chat/use-get-new-conversation';
import useGetChatConversation from '@/hooks/chat/use-get-conversation-list';
import useGetUnreadCount from '@/hooks/chat/use-get-unread-count';
import useGetChatHistoryDetail from '@/hooks/chat/use-get-chat-history-detail';
import useGetAllItemInventory from '@/app/(user)/inventory/hooks/useGetItemInventory';

import { 
  setConversations,
  updateConversation,
  addConversation,
  updateConversationOnlineStatus,
  setMessages,
  addMessage,
  setMessageInput,
  setSelectedImage,
  setSelectedConversation,
  setTotalUnreadCount,
  setLoading,
  setChatHistoryFetched,
  setInventoryItems,
  markAsRead,
  clearMessages,
  removeConversation
} from '@/stores/chat-slice';

import { 
  transformSignalRMessage,
  isMessageRelevant,
  generateLastMessagePreview,
  formatConversationDate,
  CHAT_CONSTANTS
} from '@/utils/ChatUtils/chatUtils';

import { InventoryItemStatus } from '@/const/products';
import { InventoryItem } from '@/services/inventory-item/typings';

export interface SignalRMessageHandlers {
  clearTypingForUser: (userId: string) => Promise<void>;
}

export interface ChatActions {
  handleSelectConversation: (conversationId: string) => Promise<void>;
  handleSendMessage: () => Promise<void>;
  handleInputChange: (value: string) => Promise<void>;
  handleImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSendImage: (selectedImage: File) => Promise<void>;
  handleSendProduct: (item: InventoryItem) => Promise<void>;
  handleClearImage: () => void;
  refreshChatHistory: (conversationId: string) => Promise<void>;
}

export const useSignalRMessages = (): SignalRMessageHandlers => {
  const dispatch = useAppDispatch();
  const selectedConversation = useAppSelector(state => state.chatSlice.selectedConversation);
  const currentUserId = useAppSelector(state => state.userSlice?.user?.userId);
  
  const { 
    message,
    mediaMessage,
    inventoryItemMessage,
    clearTypingForUser,
  } = useChat();

  // Handle text messages
  useEffect(() => {
    if (!message || !selectedConversation) return;
    
    if (isMessageRelevant(message, selectedConversation, currentUserId)) {
      const transformedMessage = transformSignalRMessage(message, 'text', currentUserId);
      dispatch(addMessage(transformedMessage));

      if (message.senderId !== currentUserId) {
        dispatch(updateConversation({
          otherUserId: message.senderId,
          lastMessage: generateLastMessagePreview('text', message.content),
          lastMessageTime: formatConversationDate(message.timestamp),
          unreadCount: selectedConversation === message.senderId ? 0 : 1
        }));
      }
    }
  }, [message, selectedConversation, currentUserId, dispatch]);

  // Handle media messages
  useEffect(() => {
    if (!mediaMessage || !selectedConversation) return;
    
    if (isMessageRelevant(mediaMessage, selectedConversation, currentUserId)) {
      const transformedMessage = transformSignalRMessage(mediaMessage, 'media', currentUserId);
      dispatch(addMessage(transformedMessage));

      if (mediaMessage.senderId !== currentUserId) {
        const lastMessage = generateLastMessagePreview('media', mediaMessage.content, {
          mimeType: mediaMessage.mimeType,
          fileName: mediaMessage.fileName
        });
        
        dispatch(updateConversation({
          otherUserId: mediaMessage.senderId,
          lastMessage,
          lastMessageTime: formatConversationDate(mediaMessage.timestamp),
          unreadCount: selectedConversation === mediaMessage.senderId ? 0 : 1
        }));
      }
    }
  }, [mediaMessage, selectedConversation, currentUserId, dispatch]);

  // Handle inventory messages
  useEffect(() => {
    if (!inventoryItemMessage || !selectedConversation) return;
    
    if (isMessageRelevant(inventoryItemMessage, selectedConversation, currentUserId)) {
      const transformedMessage = transformSignalRMessage(inventoryItemMessage, 'inventory', currentUserId);
      dispatch(addMessage(transformedMessage));

      if (inventoryItemMessage.senderId !== currentUserId) {
        dispatch(updateConversation({
          otherUserId: inventoryItemMessage.senderId,
          lastMessage: generateLastMessagePreview('inventory'),
          lastMessageTime: formatConversationDate(inventoryItemMessage.timestamp),
          unreadCount: selectedConversation === inventoryItemMessage.senderId ? 0 : 1
        }));
      }
    }
  }, [inventoryItemMessage, selectedConversation, currentUserId, dispatch]);

  return { clearTypingForUser };
};

/**
 * Hook to handle data fetching operations - UPDATED WITH REFRESH TRIGGER
 */
export const useChatData = (isOpen: boolean) => {
  const dispatch = useAppDispatch();
  const { 
    selectedConversation, 
    showInventory, 
    fetched
  } = useAppSelector(state => state.chatSlice);
  
  // State để trigger refresh conversations
  const [conversationRefreshTrigger, setConversationRefreshTrigger] = useState(0);
  
  // Memoize conversations to prevent unnecessary re-renders
  const conversations = useAppSelector(state => state.chatSlice.conversations);
  
  const currentUserId = useAppSelector(state => state.userSlice?.user?.userId);
  const { userStatuses, isUserOnline, isConnected, checkUserOnlineStatus } = useChat();
  
  const fetchingRefs = useRef({
    conversations: false,
    chatHistory: {} as Record<string, boolean>,
    inventory: false
  });

  // Track previous selected conversation to detect changes
  const prevSelectedConversation = useRef<string>('');

  // Memoize API hooks to prevent recreation on every render
  const { getChatConversationApi } = useGetChatConversation();
  const { getUnreadCountApi } = useGetUnreadCount();
  const { getChatHistoryDetailApi } = useGetChatHistoryDetail();
  const { getAllItemInventoryApi } = useGetAllItemInventory();

  // Expose function để trigger refresh từ bên ngoài
  const triggerConversationRefresh = useCallback(() => {
    setConversationRefreshTrigger(prev => prev + 1);
  }, []);

  // Attach trigger function to window để có thể gọi từ chat actions
  useEffect(() => {
    (window as any).triggerConversationRefresh = triggerConversationRefresh;
    return () => {
      delete (window as any).triggerConversationRefresh;
    };
  }, [triggerConversationRefresh]);

  // Fetch conversations - UPDATED với conversationRefreshTrigger
  useEffect(() => {
    const fetchConversations = async () => {
      if (fetchingRefs.current.conversations || !isOpen) return;

      fetchingRefs.current.conversations = true;
      dispatch(setLoading({ type: 'conversations', loading: true }));

      try {
        const [conversationsResponse, unreadCountResponse] = await Promise.all([
          getChatConversationApi({ pageIndex: 1, pageSize: CHAT_CONSTANTS.CONVERSATION_PAGE_SIZE }),
          getUnreadCountApi()
        ]);
        
        if (conversationsResponse?.value?.data) {
          const transformedConversations = conversationsResponse.value.data.result.map((conv: API.ChatConversation) => ({
            ...conv,
            lastMessageTime: formatConversationDate(conv.lastMessageTime)
          }));
          dispatch(setConversations(transformedConversations));
        }

        if (unreadCountResponse?.isSuccess && typeof unreadCountResponse.value === 'number') {
          dispatch(setTotalUnreadCount(unreadCountResponse.value));
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        dispatch(setLoading({ type: 'conversations', loading: false }));
        fetchingRefs.current.conversations = false;
      }
    };

    fetchConversations();
  }, [isOpen, conversationRefreshTrigger, dispatch, getChatConversationApi, getUnreadCountApi]); // Thêm conversationRefreshTrigger

  // Memoize conversation IDs to prevent unnecessary updates
  const conversationIds = useMemo(() => 
    conversations.map(conv => conv.otherUserId).join(','), 
    [conversations]
  );

  // Update conversation online status when user statuses change
  useEffect(() => {
    if (conversations.length > 0 && isConnected) {
      conversations.forEach(conv => {
        const isOnline = isUserOnline(conv.otherUserId);
        // Only update if the status actually changed
        if (conv.isOnline !== isOnline) {
          dispatch(updateConversationOnlineStatus({
            userId: conv.otherUserId,
            isOnline
          }));
        }
      });
    }
  }, [isUserOnline, isConnected, conversationIds, dispatch]);

  // FIXED: Enhanced chat history fetching
  useEffect(() => {
    const fetchChatHistory = async (conversationId: string, forceRefresh = false) => {
      const isCurrentlyFetching = fetchingRefs.current.chatHistory[conversationId];
      const alreadyFetched = fetched.chatHistory[conversationId];
      
      // Skip if already fetching, or already fetched and not forcing refresh
      if (isCurrentlyFetching || (alreadyFetched && !forceRefresh)) {
        return;
      }

      fetchingRefs.current.chatHistory[conversationId] = true;
      dispatch(setLoading({ type: 'messages', loading: true }));

      try {
        // Clear messages first if this is a conversation switch
        if (prevSelectedConversation.current !== conversationId) {
          dispatch(clearMessages());
        }

        const response = await getChatHistoryDetailApi({
          receiverId: conversationId,
          pageIndex: 1,
          pageSize: CHAT_CONSTANTS.DEFAULT_PAGE_SIZE,
        });

        if (response?.isSuccess && response.value) {
          const transformedMessages = response.value.data.result.map((msg: API.ChatHistoryDetail) => ({
            ...msg,
            id: msg.id || `history-${Date.now()}-${Math.random()}`,
            isCurrentUserSender: currentUserId ? msg.senderId === currentUserId : msg.isCurrentUserSender,
            isImage: Boolean(msg.isImage),
            isInventoryItem: Boolean(msg.isInventoryItem)
          }));

          dispatch(setMessages(transformedMessages));
          dispatch(setChatHistoryFetched({ conversationId, fetched: true }));
          
          // Check online status after loading messages
          if (isConnected) {
            await checkUserOnlineStatus(conversationId);
          }
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
        // Reset fetched status on error so user can retry
        dispatch(setChatHistoryFetched({ conversationId, fetched: false }));
      } finally {
        dispatch(setLoading({ type: 'messages', loading: false }));
        fetchingRefs.current.chatHistory[conversationId] = false;
      }
    };

    if (selectedConversation && isOpen) {
      // Detect conversation change
      const isConversationChange = prevSelectedConversation.current !== selectedConversation;
      
      if (isConversationChange) {
        // Always fetch when conversation changes
        fetchChatHistory(selectedConversation, true);
        prevSelectedConversation.current = selectedConversation;
      } else if (!fetched.chatHistory[selectedConversation]) {
        // Fetch if not yet fetched for current conversation
        fetchChatHistory(selectedConversation, false);
      }
    }
  }, [selectedConversation, isOpen, fetched.chatHistory, dispatch, getChatHistoryDetailApi, currentUserId, isConnected, checkUserOnlineStatus]);

  // Fetch inventory
  useEffect(() => {
    const fetchInventory = async () => {
      if (fetchingRefs.current.inventory || fetched.inventory || !showInventory) return;

      fetchingRefs.current.inventory = true;
      dispatch(setLoading({ type: 'inventory', loading: true }));

      try {
        const response = await getAllItemInventoryApi({ 
          pageIndex: 1, 
          pageSize: CHAT_CONSTANTS.INVENTORY_PAGE_SIZE 
        });
        
        const isSuccess = response && (response.success || response.isSuccess);
        const responseData = response?.data || response?.value;
        
        if (isSuccess && responseData) {
          const itemsArray = responseData.result || responseData.data?.result || responseData.data?.items || responseData.data || [];
          const availableItems = itemsArray.filter(
            (item: InventoryItem) => item.status === InventoryItemStatus.Available
          );
          dispatch(setInventoryItems(availableItems));
        }
      } catch (error) {
        console.error('Error fetching inventory:', error);
      } finally {
        dispatch(setLoading({ type: 'inventory', loading: false }));
        fetchingRefs.current.inventory = false;
      }
    };

    fetchInventory();
  }, [showInventory, fetched.inventory, dispatch, getAllItemInventoryApi]);

  // Memoize interval ref to prevent recreation
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Periodic unread count refresh
  useEffect(() => {
    if (!isOpen) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Clear existing interval before creating new one
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(async () => {
      try {
        const response = await getUnreadCountApi();
        if (response?.isSuccess && typeof response.value === 'number') {
          dispatch(setTotalUnreadCount(response.value));
        }
      } catch (error) {
        console.error('Error refreshing unread count:', error);
      }
    }, CHAT_CONSTANTS.UNREAD_REFRESH_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isOpen, getUnreadCountApi, dispatch]);

  return { triggerConversationRefresh };
};

/**
 * Hook to handle chat actions and interactions - UPDATED WITH REFRESH TRIGGER
 */
export const useChatActions = (): ChatActions => {
  const dispatch = useAppDispatch();
  const { selectedConversation, messageInput } = useAppSelector(state => state.chatSlice);
  const conversations = useAppSelector(state => state.chatSlice.conversations);
  
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { 
    isConnected, 
    sendMessage, 
    startTyping, 
    stopTyping, 
    clearTypingForUser,
    isUserOnline,
    checkUserOnlineStatus
  } = useChat();

  // API hooks
  const { getChatHistoryDetailApi } = useGetChatHistoryDetail();
  const currentUserId = useAppSelector(state => state.userSlice?.user?.userId);

  // Memoize the mark as read callback to prevent recreation
  const handleMarkAsRead = useCallback((fromUserId: string) => {
    dispatch(markAsRead(fromUserId));
  }, [dispatch]);

  const markAsReadMutation = useServiceMarkMessageAsRead(handleMarkAsRead);

  const { useSendImageUserApi } = useSendImageUser();
  const { useSendInventoryItemUserApi } = useSendInventoryItemUser();
  const { getNewChatConversationApi } = useGetNewChatConversation();
  const { getChatConversationApi } = useGetChatConversation();
  
  // Helper function để trigger refresh conversations
  const triggerRefresh = useCallback(() => {
    if ((window as any).triggerConversationRefresh) {
      (window as any).triggerConversationRefresh();
    }
  }, []);

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Refresh chat history function
  const refreshChatHistory = useCallback(async (conversationId: string) => {
    if (!conversationId) return;
    
    dispatch(setLoading({ type: 'messages', loading: true }));
    dispatch(clearMessages());
    
    try {
      const response = await getChatHistoryDetailApi({
        receiverId: conversationId,
        pageIndex: 1,
        pageSize: CHAT_CONSTANTS.DEFAULT_PAGE_SIZE,
      });

      if (response?.isSuccess && response.value) {
        const transformedMessages = response.value.data.result.map((msg: API.ChatHistoryDetail) => ({
          ...msg,
          id: msg.id || `history-${Date.now()}-${Math.random()}`,
          isCurrentUserSender: currentUserId ? msg.senderId === currentUserId : msg.isCurrentUserSender,
          isImage: Boolean(msg.isImage),
          isInventoryItem: Boolean(msg.isInventoryItem)
        }));

        dispatch(setMessages(transformedMessages));
        dispatch(setChatHistoryFetched({ conversationId, fetched: true }));
      }
    } catch (error) {
      console.error('Error refreshing chat history:', error);
    } finally {
      dispatch(setLoading({ type: 'messages', loading: false }));
    }
  }, [dispatch, getChatHistoryDetailApi, currentUserId]);

  const handleSelectConversation = useCallback(async (targetUserId : string) => {
    const targetConversation = conversations.find(conv => conv.otherUserId === targetUserId );
    const newConversation = conversations.find(conv => conv.lastMessageTime == null);


    if (newConversation && (newConversation.otherUserId !== targetUserId || targetConversation == newConversation)) {
      
      dispatch(removeConversation(newConversation.otherUserId));
    }

    // Case 1: New conversation exists and matches target user
    if (newConversation && newConversation.otherUserId === targetUserId) {
      dispatch(setSelectedConversation(targetUserId));
      await checkUserOnlineStatus(targetUserId );
      return;
    }
    
    // Create new conversation if doesn't exist
    try {
      const response = await getNewChatConversationApi(targetUserId);
      if (response?.value?.data) {
        const newConv: API.ChatConversation = {
          otherUserId: targetUserId ,
          otherUserName: response.value.data.otherUserName,
          otherUserAvatar: response.value.data.otherUserAvatar,
          lastMessage: '',
          lastMessageTime: null,
          unreadCount: 0,
          isOnline: isUserOnline(targetUserId ),
          isSeller: response.value.data.isSeller
        };
        dispatch(addConversation(newConv));
        dispatch(setSelectedConversation(targetUserId));
      }
    } catch (error) {
      console.error('Error creating new conversation:', error);
      return;
    }

    // Check online status if connected
    if (isConnected) {
      await checkUserOnlineStatus(targetUserId );
    }

    // Mark as read if needed
    const selectedConv = conversations.find(conv => conv.otherUserId === targetUserId );
    if (selectedConv && selectedConv.unreadCount > 0) {
      markAsReadMutation.mutate({ fromUserId: targetUserId  });
    }
  }, [conversations, dispatch, getNewChatConversationApi, isUserOnline, markAsReadMutation, isConnected, checkUserOnlineStatus]);

// Tối ưu handleSendMessage (không thay đổi nhiều nhưng clean hơn)
const handleSendMessage = useCallback(async () => {
  if (!messageInput.trim() || !selectedConversation || !isConnected) return;

  const messageContent = messageInput.trim();
  dispatch(setMessageInput(''));

  // Clear typing timeout
  if (typingTimeoutRef.current) {
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = null;
  }

  try {
    await sendMessage(selectedConversation, messageContent);
    triggerRefresh(); // Refresh conversations after successful send
  } catch (error) {
    console.error('Failed to send message:', error);
    // Restore message input on error
    dispatch(setMessageInput(messageContent));
  }
}, [messageInput, selectedConversation, isConnected, dispatch, sendMessage, triggerRefresh]);

  const handleInputChange = useCallback(async (value: string) => {
    dispatch(setMessageInput(value));

    if (!selectedConversation || !isConnected) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    if (value.trim()) {
      await startTyping(selectedConversation);
      typingTimeoutRef.current = setTimeout(async () => {
        await stopTyping(selectedConversation);
        typingTimeoutRef.current = null;
      }, CHAT_CONSTANTS.TYPING_TIMEOUT);
    } else {
      await stopTyping(selectedConversation);
    }
  }, [selectedConversation, isConnected, dispatch, startTyping, stopTyping]);

  const handleImageSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        dispatch(setSelectedImage({
          file,
          preview: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  }, [dispatch]);

  const handleSendImage = useCallback(async (selectedImage: File) => {
    if (!selectedImage || !selectedConversation || !isConnected) return;

    await clearTypingForUser(selectedConversation);

    try {
      const response = await useSendImageUserApi({
        receiverId: selectedConversation,
        imageFile: selectedImage
      });

      if (response?.isSuccess) {
        dispatch(setSelectedImage({ file: null, preview: null }));
        const fileInput = document.getElementById('image-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
        // Trigger refresh conversations sau khi gửi image thành công
        triggerRefresh();
      }
    } catch (error) {
      console.error('Failed to send image:', error);
    }
  }, [selectedConversation, isConnected, clearTypingForUser, dispatch, triggerRefresh]);

  const handleSendProduct = useCallback(async (item: InventoryItem) => {
    if (!selectedConversation || !isConnected) return;

    await clearTypingForUser(selectedConversation);

    try {
      await useSendInventoryItemUserApi({
        receiverId: selectedConversation,
        inventoryItemId: item.id,
      });
      
      // Trigger refresh conversations sau khi gửi inventory item thành công
      triggerRefresh();
      
    } catch (error) {
      console.error('Failed to send product:', error);
    }
  }, [selectedConversation, isConnected, clearTypingForUser, useSendInventoryItemUserApi, triggerRefresh]);

  const handleClearImage = useCallback(() => {
    dispatch(setSelectedImage({ file: null, preview: null }));
    const fileInput = document.getElementById('image-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }, [dispatch]);

  return {
    handleSelectConversation,
    handleSendMessage,
    handleInputChange,
    handleImageSelect,
    handleSendImage,
    handleSendProduct,
    handleClearImage,
    refreshChatHistory,
  };
};