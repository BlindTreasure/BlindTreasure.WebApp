// hooks/useChatHooks.ts
import { useEffect, useRef, useCallback } from 'react';
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
  markAsRead
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
}
export const useSignalRMessages = (): SignalRMessageHandlers => {
  const dispatch = useAppDispatch();
  const { selectedConversation } = useAppSelector(state => state.chatSlide);
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
 * Hook to handle data fetching operations
 */
export const useChatData = (isOpen: boolean) => {
  const dispatch = useAppDispatch();
  const { 
    selectedConversation, 
    showInventory, 
    fetched,
    conversations
  } = useAppSelector(state => state.chatSlide);
  
  const currentUserId = useAppSelector(state => state.userSlice?.user?.userId);
  const { userStatuses, isUserOnline, isConnected } = useChat();
  
  const fetchingRefs = useRef({
    conversations: false,
    chatHistory: {} as Record<string, boolean>,
    inventory: false
  });

  const { getChatConversationApi } = useGetChatConversation();
  const { getUnreadCountApi } = useGetUnreadCount();
  const { getChatHistoryDetailApi } = useGetChatHistoryDetail();
  const { getAllItemInventoryApi } = useGetAllItemInventory();

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      if (fetchingRefs.current.conversations || fetched.conversations || !isOpen) return;

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
  }, [isOpen, fetched.conversations, dispatch, getChatConversationApi, getUnreadCountApi]);

  // Update conversation online status when user statuses change
  useEffect(() => {
    if (conversations.length > 0 && isConnected) {
      conversations.forEach(conv => {
        const isOnline = isUserOnline(conv.otherUserId);
        dispatch(updateConversationOnlineStatus({
          userId: conv.otherUserId,
          isOnline
        }));
      });
    }
  }, [userStatuses, isUserOnline, isConnected, conversations, dispatch]);

  // Fetch chat history
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!selectedConversation || 
          fetchingRefs.current.chatHistory[selectedConversation] ||
          fetched.chatHistory[selectedConversation]) return;

      fetchingRefs.current.chatHistory[selectedConversation] = true;
      dispatch(setLoading({ type: 'messages', loading: true }));

      try {
        const response = await getChatHistoryDetailApi({
          receiverId: selectedConversation,
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
          dispatch(setChatHistoryFetched({ conversationId: selectedConversation, fetched: true }));
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
      } finally {
        dispatch(setLoading({ type: 'messages', loading: false }));
        fetchingRefs.current.chatHistory[selectedConversation] = false;
      }
    };

    if (selectedConversation && isOpen) {
      fetchChatHistory();
    }
  }, [selectedConversation, isOpen, fetched.chatHistory, dispatch, getChatHistoryDetailApi, currentUserId]);

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

  // Periodic unread count refresh
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(async () => {
      try {
        const response = await getUnreadCountApi();
        if (response?.isSuccess && typeof response.value === 'number') {
          dispatch(setTotalUnreadCount(response.value));
        }
      } catch (error) {
        console.error('Error refreshing unread count:', error);
      }
    }, CHAT_CONSTANTS.UNREAD_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [isOpen, getUnreadCountApi, dispatch]);
};

/**
 * Hook to handle chat actions and interactions
 */
export const useChatActions = (): ChatActions => {
  const dispatch = useAppDispatch();
  const { conversations, selectedConversation, messageInput } = useAppSelector(state => state.chatSlide);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { 
    isConnected, 
    sendMessage, 
    startTyping, 
    stopTyping, 
    clearTypingForUser,
    isUserOnline 
  } = useChat();

  const markAsReadMutation = useServiceMarkMessageAsRead((fromUserId: string) => {
    dispatch(markAsRead(fromUserId));
  });

  const { useSendImageUserApi } = useSendImageUser();
  const { useSendInventoryItemUserApi } = useSendInventoryItemUser();
  const { getNewChatConversationApi } = useGetNewChatConversation();

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleSelectConversation = useCallback(async (conversationId: string) => {
    const existingConversation = conversations.find(conv => conv.otherUserId === conversationId);

    if (!existingConversation) {
      try {
        const response = await getNewChatConversationApi(conversationId);
        if (response?.value?.data) {
          const newConversation: API.ChatConversation = {
            otherUserId: conversationId,
            otherUserName: response.value.data.otherUserName,
            otherUserAvatar: response.value.data.otherUserAvatar,
            lastMessage: '',
            lastMessageTime: null,
            unreadCount: 0,
            isOnline: isUserOnline(conversationId),
            isSeller: response.value.data.isSeller
          };
          dispatch(addConversation(newConversation));
        }
      } catch (error) {
        console.error('Error creating new conversation:', error);
        return;
      }
    }

    dispatch(setSelectedConversation(conversationId));

    const selectedConv = conversations.find(conv => conv.otherUserId === conversationId);
    if (selectedConv && selectedConv?.unreadCount > 0) {
      markAsReadMutation.mutate({ fromUserId: conversationId });
    }
  }, [conversations, dispatch, getNewChatConversationApi, isUserOnline, markAsReadMutation]);

  const handleSendMessage = useCallback(async () => {
    if (!messageInput.trim() || !selectedConversation || !isConnected) return;

    const messageContent = messageInput.trim();
    dispatch(setMessageInput(''));

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    try {
      await sendMessage(selectedConversation, messageContent);
    } catch (error) {
      console.error('Failed to send message:', error);
      dispatch(setMessageInput(messageContent));
    }
  }, [messageInput, selectedConversation, isConnected, dispatch, sendMessage]);

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
      }
    } catch (error) {
      console.error('Failed to send image:', error);
    }
  }, [selectedConversation, isConnected, clearTypingForUser, useSendImageUserApi, dispatch]);

  const handleSendProduct = useCallback(async (item: InventoryItem) => {
    if (!selectedConversation || !isConnected) return;

    await clearTypingForUser(selectedConversation);

    try {
      await useSendInventoryItemUserApi({
        receiverId: selectedConversation,
        inventoryItemId: item.id,
      });
    } catch (error) {
      console.error('Failed to send product:', error);
    }
  }, [selectedConversation, isConnected, clearTypingForUser, useSendInventoryItemUserApi]);

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
  };
};