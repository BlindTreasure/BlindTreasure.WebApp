'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppSelector } from '@/stores/store';
import useGetAllItemInventory from '@/app/(user)/inventory/hooks/useGetItemInventory';
import useGetChatConversation from '@/hooks/use-get-conversation-list';
import useGetUnreadCount from '@/hooks/use-get-unread-count';
import useGetChatHistoryDetail from '@/hooks/use-get-chat-history-detail';
import { useChat } from '@/hooks/use-send-message-user';
import { useServiceMarkMessageAsRead } from '@/services/chat/services';
import useSendImageUser from '@/hooks/use-send-image-user';
import useSendInventoryItemUser from '@/hooks/use-send-inventory-item-to-user';
import { InventoryItem } from '@/services/inventory-item/typings';
import { InventoryItemStatus } from '@/const/products';
import { TooltipProvider } from '../ui/tooltip';
import { IoChatbubblesOutline } from "react-icons/io5";
import ConversationList from './components/ConversationList';
import ChatArea from './components/ChatArea';
import InventoryPanel from './components/InventoryPanel';
import MobileInventoryModal from './components/MobileInventoryModal';
import { MessageType } from '@/const/chat';

const CustomerSellerChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [showInventory, setShowInventory] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [messages, setMessages] = useState<API.ChatHistoryDetail[]>([]);
  const [inventoryFetched, setInventoryFetched] = useState(false);

  // Get current user from Redux store
  const currentUser = useAppSelector((state) => state.userSlice?.user);
  const currentUserId = currentUser?.userId;

  // Existing conversation states
  const [conversations, setConversations] = useState<API.ChatConversation[]>([]);
  const [conversationsLoading, setConversationsLoading] = useState(false);
  const [conversationsFetched, setConversationsFetched] = useState(false);

  // New state for unread count
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);

  // New states for chat history
  const [chatHistory, setChatHistory] = useState<API.ChatHistoryDetail[]>([]);
  const [chatHistoryLoading, setChatHistoryLoading] = useState(false);
  const [chatHistoryFetched, setChatHistoryFetched] = useState<Record<string, boolean>>({});

  const fetchingRef = useRef(false);
  const conversationsFetchingRef = useRef(false);
  const chatHistoryFetchingRef = useRef<Record<string, boolean>>({});
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize useChat hook with new structure
  const { 
    isConnected, 
    message,
    mediaMessage,
    inventoryItemMessage,
    userStatuses,
    typingUsers,
    sendMessage, 
    startTyping,
    stopTyping,
    clearMessages,
    clearTypingForUser,
    isUserOnline,
    checkUserOnlineStatus,
  } = useChat();

  const markAsReadMutation = useServiceMarkMessageAsRead((fromUserId: string) => {
    setConversations(prev => prev.map(conv =>
      conv.otherUserId === fromUserId
        ? { ...conv, unreadCount: 0 }
        : conv
    ));

    // Update total unread count
    setTotalUnreadCount(prev => {
      const targetConv = conversations.find(conv => conv.otherUserId === fromUserId);
      const unreadToSubtract = targetConv?.unreadCount || 0;
      return Math.max(0, prev - unreadToSubtract);
    });
  });

  const { getAllItemInventoryApi } = useGetAllItemInventory();
  const { isPending: isConversationsPending, getChatConversationApi } = useGetChatConversation();
  const { isPending: isUnreadCountPending, getUnreadCountApi } = useGetUnreadCount();
  const { isPending: isChatHistoryPending, getChatHistoryDetailApi } = useGetChatHistoryDetail();
  
  // Initialize send image hook
  const { isPending: isSendingImage, useSendImageUserApi } = useSendImageUser();
  
  // Initialize send inventory item hook
  const { isPending: isSendingInventoryItem, useSendInventoryItemUserApi } = useSendInventoryItemUser();

  // Helper function to check if user is typing
  const isUserTyping = (userId: string): boolean => {
    return typingUsers[userId]?.isTyping ?? false;
  };

  // Get selected conversation info with online status and typing status - REACTIVE VERSION
  const selectedConversationInfo = useMemo(() => {
    if (!selectedConversation) return undefined;
    
    const baseInfo = conversations.find(conv => conv.otherUserId === selectedConversation);
    if (!baseInfo) return undefined;

    const onlineStatus = isUserOnline(selectedConversation);
    const typingStatus = isUserTyping(selectedConversation);
    
    return {
      ...baseInfo,
      isOnline: onlineStatus,
      isTyping: typingStatus
    };
  }, [
    selectedConversation, 
    conversations, 
    userStatuses,
    typingUsers,
    isUserOnline
  ]);

  // Helper function to get sender info from previous messages
  const getSenderInfo = (senderId: string) => {
    // Find the most recent message from this sender to get name/avatar
    const previousMessage = messages
      .slice()
      .reverse()
      .find(msg => msg.senderId === senderId && msg.senderName && msg.senderAvatar);
    
    return {
      senderName: previousMessage?.senderName || '',
      senderAvatar: previousMessage?.senderAvatar || ''
    };
  };

  // Helper function to transform SignalR message to API.ChatHistoryDetail
  const transformSignalRMessage = (
    msg: SIGNALR.ReceiveMessage | SIGNALR.ReceiveMediaMessage | SIGNALR.ReceiveInventoryItemMessage,
    type: 'text' | 'media' | 'inventory'
  ): API.ChatHistoryDetail => {
    // Get sender info from message or fallback to previous messages
    const senderInfo = 'senderName' in msg && 'senderAvatar' in msg 
      ? { senderName: msg.senderName || '', senderAvatar: msg.senderAvatar || '' }
      : getSenderInfo(msg.senderId);

    const baseMessage: API.ChatHistoryDetail = {
      id: msg.id || `realtime-${Date.now()}-${Math.random()}`,
      senderId: msg.senderId,
      senderName: senderInfo.senderName,
      senderAvatar: senderInfo.senderAvatar,
      receiverId: msg.receiverId,
      content: msg.content || '',
      sentAt: msg.timestamp, // Use timestamp from SignalR
      isCurrentUserSender: msg.senderId === currentUserId,
      isRead: msg.isRead,
      messageType: MessageType.UserToUser, // Default for text messages
      isImage: false,
      fileUrl: null,
      fileName: null,
      fileSize: null,
      fileMimeType: null,
      inventoryItemId: null,
      inventoryItem: null,
      isInventoryItem: false
    };

    if (type === 'media') {
      const mediaMsg = msg as SIGNALR.ReceiveMediaMessage;
      const isImageFile = mediaMsg.mimeType?.startsWith('image/') || 
                         mediaMsg.fileName?.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/);
      
      // Determine message type from SignalR messageType or infer from file type
      let messageType = MessageType.UserToUser; // default
      if (mediaMsg.messageType) {
        messageType = mediaMsg.messageType as MessageType;
      } else {
        // Fallback: infer from file type
        messageType = isImageFile ? MessageType.ImageMessage : MessageType.VideoMessage;
      }
      
      return {
        ...baseMessage,
        messageType,
        isImage: messageType === MessageType.ImageMessage,
        fileUrl: msg.content, // content contains the file URL
        fileName: mediaMsg.fileName,
        fileSize: mediaMsg.fileSize,
        fileMimeType: mediaMsg.mimeType
      };
    }

    if (type === 'inventory') {
      const inventoryMsg = msg as SIGNALR.ReceiveInventoryItemMessage;
      
      // Use messageType from SignalR or default to InventoryItemMessage
      const messageType = inventoryMsg.messageType ? 
        (inventoryMsg.messageType as MessageType) : 
        MessageType.InventoryItemMessage;
      
      return {
        ...baseMessage,
        messageType,
        isInventoryItem: true,
        inventoryItemId: inventoryMsg.inventoryItem.Id,
        inventoryItem: {
          id: inventoryMsg.inventoryItem.Id,
          productId: inventoryMsg.inventoryItem.ProductId,
          productName: inventoryMsg.inventoryItem.ProductName,
          image: inventoryMsg.inventoryItem.Image,
          tier: inventoryMsg.inventoryItem.Tier,
          location: inventoryMsg.inventoryItem.Location,
          status: inventoryMsg.inventoryItem.Status,
          isFromBlindBox: inventoryMsg.inventoryItem.IsFromBlindbox,
          isOnHold: inventoryMsg.inventoryItem.IsOnHold,
          hasActiveListing: inventoryMsg.inventoryItem.HasActiveListing 
        }
      };
    }

    // Text message - always UserToUser for regular chat
    return {
      ...baseMessage,
      messageType: MessageType.UserToUser
    };
  };

  // Handle incoming text messages
  useEffect(() => {
    if (message && selectedConversation) {
      // Check if message is relevant to current conversation
      const isRelevant = 
        (message.receiverId === selectedConversation && message.senderId === currentUserId) ||
        (message.senderId === selectedConversation && message.receiverId === currentUserId);

      if (isRelevant) {
        const transformedMessage = transformSignalRMessage(message, 'text');
        
        setMessages(prev => {
          // Avoid duplicates by checking id first, then fallback to content + timestamp
          const isDuplicate = prev.some(existingMsg =>
            existingMsg.id === transformedMessage.id ||
            (existingMsg.content === transformedMessage.content &&
             existingMsg.sentAt === transformedMessage.sentAt &&
             existingMsg.senderId === transformedMessage.senderId)
          );

          if (isDuplicate) {
            return prev;
          }

          return [...prev, transformedMessage];
        });

        // Update conversation's last message
        if (message.senderId !== currentUserId) {
          setConversations(prev => prev.map(conv =>
            conv.otherUserId === message.senderId
              ? { 
                  ...conv, 
                  lastMessage: message.content || '',
                  lastMessageTime: new Date(message.timestamp).toLocaleDateString('vi-VN'),
                  unreadCount: selectedConversation === message.senderId ? conv.unreadCount : conv.unreadCount + 1
                }
              : conv
          ));
        }
      }
    }
  }, [message, selectedConversation, currentUserId]);

  // Handle incoming media messages
  useEffect(() => {
    if (mediaMessage && selectedConversation) {
      const isRelevant = 
        (mediaMessage.receiverId === selectedConversation && mediaMessage.senderId === currentUserId) ||
        (mediaMessage.senderId === selectedConversation && mediaMessage.receiverId === currentUserId);

      if (isRelevant) {
        const transformedMessage = transformSignalRMessage(mediaMessage, 'media');
        
        setMessages(prev => {
          const isDuplicate = prev.some(existingMsg =>
            existingMsg.id === transformedMessage.id ||
            (existingMsg.fileUrl === transformedMessage.fileUrl &&
             existingMsg.sentAt === transformedMessage.sentAt &&
             existingMsg.senderId === transformedMessage.senderId)
          );

          if (isDuplicate) {
            return prev;
          }

          return [...prev, transformedMessage];
        });

        // Update conversation's last message
        if (mediaMessage.senderId !== currentUserId) {
          const isImageFile = mediaMessage.mimeType?.startsWith('image/') || 
                             mediaMessage.fileName?.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/);
          const lastMessage = isImageFile ? 'Đã gửi một hình ảnh' : 'Đã gửi một video';
            
          setConversations(prev => prev.map(conv =>
            conv.otherUserId === mediaMessage.senderId
              ? { 
                  ...conv, 
                  lastMessage,
                  lastMessageTime: new Date(mediaMessage.timestamp).toLocaleDateString('vi-VN'),
                  unreadCount: selectedConversation === mediaMessage.senderId ? conv.unreadCount : conv.unreadCount + 1
                }
              : conv
          ));
        }
      }
    }
  }, [mediaMessage, selectedConversation, currentUserId]);

  // Handle incoming inventory item messages
  useEffect(() => {
    if (inventoryItemMessage && selectedConversation) {
      const isRelevant = 
        (inventoryItemMessage.receiverId === selectedConversation && inventoryItemMessage.senderId === currentUserId) ||
        (inventoryItemMessage.senderId === selectedConversation && inventoryItemMessage.receiverId === currentUserId);

      if (isRelevant) {
        const transformedMessage = transformSignalRMessage(inventoryItemMessage, 'inventory');
        
        setMessages(prev => {
          const isDuplicate = prev.some(existingMsg =>
            existingMsg.id === transformedMessage.id ||
            (existingMsg.inventoryItemId === transformedMessage.inventoryItemId &&
             existingMsg.sentAt === transformedMessage.sentAt &&
             existingMsg.senderId === transformedMessage.senderId)
          );

          if (isDuplicate) {
            return prev;
          }

          return [...prev, transformedMessage];
        });

        // Update conversation's last message
        if (inventoryItemMessage.senderId !== currentUserId) {
          setConversations(prev => prev.map(conv =>
            conv.otherUserId === inventoryItemMessage.senderId
              ? { 
                  ...conv, 
                  lastMessage: 'Đã gửi một inventory item',
                  lastMessageTime: new Date(inventoryItemMessage.timestamp).toLocaleDateString('vi-VN'),
                  unreadCount: selectedConversation === inventoryItemMessage.senderId ? conv.unreadCount : conv.unreadCount + 1
                }
              : conv
          ));
        }
      }
    }
  }, [inventoryItemMessage, selectedConversation, currentUserId]);

  // Fetch chat history when a conversation is selected
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!selectedConversation ||
        chatHistoryFetchingRef.current[selectedConversation] ||
        chatHistoryFetched[selectedConversation]) {
        return;
      }

      chatHistoryFetchingRef.current[selectedConversation] = true;
      setChatHistoryLoading(true);

      try {
        const response = await getChatHistoryDetailApi({
          receiverId: selectedConversation,
          pageIndex: 1,
          pageSize: 50,
        });

        if (response && response.isSuccess && response.value) {
          setChatHistory(response.value.data.result);

          const transformedMessages: API.ChatHistoryDetail[] = response.value.data.result.map((msg: API.ChatHistoryDetail) => ({
            id: msg.id || `history-${Date.now()}-${Math.random()}`,
            senderId: msg.senderId || '',
            senderName: msg.senderName || '',
            senderAvatar: msg.senderAvatar || '',
            receiverId: msg.receiverId || selectedConversation,
            content: msg.content || '',
            sentAt: msg.sentAt || new Date().toISOString(),
            isCurrentUserSender: currentUserId ? msg.senderId === currentUserId : msg.isCurrentUserSender === true,
            isRead: msg.isRead || false,
            messageType: msg.messageType,
            isImage: Boolean(msg.isImage),
            fileUrl: msg.fileUrl,
            fileName: msg.fileName,
            fileSize: msg.fileSize,
            fileMimeType: msg.fileMimeType,
            inventoryItemId: msg.inventoryItemId,
            inventoryItem: msg.inventoryItem,
            isInventoryItem: Boolean(msg.isInventoryItem)
          }));

          setMessages(transformedMessages);
          setChatHistoryFetched(prev => ({ ...prev, [selectedConversation]: true }));
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
        setMessages([]);
      } finally {
        setChatHistoryLoading(false);
        chatHistoryFetchingRef.current[selectedConversation] = false;
      }
    };

    if (selectedConversation && isOpen) {
      fetchChatHistory();
    }
  }, [selectedConversation, isOpen, getChatHistoryDetailApi, chatHistoryFetched, currentUserId]);

  // Reset chat history when conversation changes
  useEffect(() => {
    if (selectedConversation && !chatHistoryFetched[selectedConversation]) {
      setMessages([]);
      clearMessages(); // Clear SignalR messages
    }
  }, [selectedConversation, chatHistoryFetched, clearMessages]);

  // Fetch unread count when component mounts and periodically
  useEffect(() => {
    if (!currentUser) return;

    const fetchUnreadCount = async () => {
      try {
        const response = await getUnreadCountApi();
        if (response && response.isSuccess && typeof response.value === 'number') {
          setTotalUnreadCount(response.value);
        }
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [getUnreadCountApi, currentUser?.userId]); 

  // Fetch conversations when chat is opened
  useEffect(() => {
    const fetchConversations = async () => {
      if (conversationsFetchingRef.current || conversationsFetched || !isOpen) return;

      conversationsFetchingRef.current = true;
      setConversationsLoading(true);

      try {
        const [conversationsResponse, unreadCountResponse] = await Promise.all([
          getChatConversationApi({
            pageIndex: 1,
            pageSize: 20,
          }),
          getUnreadCountApi()
        ]);
        
        if (conversationsResponse && conversationsResponse.value.data) {
          const transformedConversations: API.ChatConversation[] = conversationsResponse.value.data.result.map((conv: API.ChatConversation) => ({
            otherUserId: conv.otherUserId,
            otherUserName: conv.otherUserName,
            otherUserAvatar: conv.otherUserAvatar,
            lastMessage: conv.lastMessage,
            lastMessageTime: conv.lastMessageTime ? new Date(conv.lastMessageTime).toLocaleDateString('vi-VN') : '',
            unreadCount: conv.unreadCount,
            isOnline: conv.isOnline, // Lấy từ API response
          }));

          setConversations(transformedConversations);
          setConversationsFetched(true);
        }

        if (unreadCountResponse && unreadCountResponse.isSuccess && typeof unreadCountResponse.value === 'number') {
          setTotalUnreadCount(unreadCountResponse.value);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
        setConversations([]);
      } finally {
        setConversationsLoading(false);
        conversationsFetchingRef.current = false;
      }
    };

    if (isOpen && !conversationsFetched) {
      fetchConversations();
    }
  }, [isOpen, conversationsFetched, getChatConversationApi, getUnreadCountApi]);

  // Update conversation online status when user statuses change from SignalR
  useEffect(() => {
    if (conversations.length > 0 && isConnected) {
      setConversations(prev => prev.map(conv => ({
        ...conv,
        isOnline: isUserOnline(conv.otherUserId)
      })));
    }
  }, [userStatuses, isUserOnline, isConnected]);

  useEffect(() => {
    const fetchInventory = async () => {
      if (fetchingRef.current || inventoryFetched) return;

      fetchingRef.current = true;
      setInventoryLoading(true);

      try {
        const response = await getAllItemInventoryApi({
          pageIndex: 1,
          pageSize: 50,
        });

        const isSuccess = response && (response.success || response.isSuccess);
        const responseData = response?.data || response?.value;
        if (isSuccess && responseData) {
          const itemsArray = responseData.result || responseData.data?.result || responseData.data?.items || responseData.data || [];
          const availableItems = itemsArray.filter(
            (item: InventoryItem) => item.status === InventoryItemStatus.Available
          );

          setInventoryItems(availableItems);
          setInventoryFetched(true);
        }
      } catch (error) {
        console.error('Error fetching inventory:', error);
      } finally {
        setInventoryLoading(false);
        fetchingRef.current = false;
      }
    };

    if (showInventory && !inventoryFetched) {
      fetchInventory();
    }
  }, [showInventory, getAllItemInventoryApi, inventoryFetched]);

  const filteredConversations = conversations.filter(conv =>
    conv.otherUserName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const conversationUnreadTotal = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
  const displayUnreadCount = totalUnreadCount > 0 ? totalUnreadCount : conversationUnreadTotal;

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);

    // Find selected conversation
    const selectedConv = conversations.find(conv => conv.otherUserId === conversationId);

    // If conversation has unread messages, mark as read
    if (selectedConv && selectedConv.unreadCount > 0) {
      markAsReadMutation.mutate({ fromUserId: conversationId });
    }

    // NEW: Check user online status when selecting conversation
    if (isConnected) {
      checkUserOnlineStatus(conversationId);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation || !isConnected) return;

    const messageContent = messageInput.trim();
    setMessageInput('');

    // Clear typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    try {
      await sendMessage(selectedConversation, messageContent);
      // sendMessage trong hook đã tự động gọi stopTyping
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessageInput(messageContent);
    }
  };

  // FIXED: Handle typing indicators with improved logic
  const handleInputChange = async (value: string) => {
    setMessageInput(value);

    if (!selectedConversation || !isConnected) return;

    // Clear existing timeout first
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    if (value.trim()) {
      // Start typing (hook sẽ tự debounce)
      await startTyping(selectedConversation);

      // Set timeout to stop typing after 1 second of no input
      typingTimeoutRef.current = setTimeout(async () => {
        await stopTyping(selectedConversation);
        typingTimeoutRef.current = null;
      }, 1000);
    } else {
      // Stop typing immediately if input is empty
      await stopTyping(selectedConversation);
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendImage = async () => {
    if (!selectedImage || !selectedConversation || !isConnected) return;

    // Clear typing before sending image
    await clearTypingForUser(selectedConversation);

    try {
      // Call API to send image
      const response = await useSendImageUserApi({
        receiverId: selectedConversation,
        imageFile: selectedImage
      });

      if (response && response.isSuccess) {
        // Clear image after successful send - SignalR will handle message display
        setSelectedImage(null);
        setImagePreview(null);
        const fileInput = document.getElementById('image-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        console.error('Failed to send image: API returned error');
      }
    } catch (error) {
      console.error('Failed to send image:', error);
    }
  };

  const handleSendProduct = async (item: InventoryItem) => {
    if (!selectedConversation || !isConnected) return;

    // Clear typing before sending product
    await clearTypingForUser(selectedConversation);

    try {
      const response = await useSendInventoryItemUserApi({
        receiverId: selectedConversation,
        inventoryItemId: item.id,
      });

      if (response && response.isSuccess) {
        console.log('Product sent successfully via API');
      } else {
        console.error('Failed to send product: API returned error');
      }
    } catch (error) {
      console.error('Failed to send product:', error);
    }
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    const fileInput = document.getElementById('image-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={() => setIsOpen(true)}
          className="relative bg-green-500 hover:bg-opacity-80 text-white rounded-full w-auto px-4 h-12 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
        >
          <IoChatbubblesOutline className="text-4xl" />
          <span className="text-lg font-medium">Chat</span>

          {displayUnreadCount > 0 && (
            <Badge className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] min-w-[18px] h-5 px-1 rounded-full flex items-center justify-center animate-pulse">
              {displayUnreadCount > 99 ? '99+' : displayUnreadCount}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="fixed bottom-6 right-6 z-50">
        <div className={`bg-white rounded-lg shadow-2xl border h-[600px] flex overflow-hidden animate-in slide-in-from-bottom-4 max-w-[95vw] max-h-[95vh] transition-all duration-300 ${showInventory ? 'w-[1200px] md:max-w-[1200px]' : 'w-[800px] md:max-w-[800px]'}`}>
          <ConversationList
            conversations={filteredConversations}
            selectedConversation={selectedConversation}
            searchQuery={searchQuery}
            totalUnread={displayUnreadCount}
            loading={conversationsLoading || isConversationsPending}
            onSelectConversation={handleSelectConversation}
            onSearchChange={setSearchQuery}
            onClose={() => setIsOpen(false)}
          />

          <ChatArea
            selectedConversation={selectedConversation}
            selectedConversationInfo={selectedConversationInfo}
            messages={messages}
            messageInput={messageInput}
            imagePreview={imagePreview}
            showInventory={showInventory}
            chatHistoryLoading={chatHistoryLoading || isChatHistoryPending}
            isSendingImage={isSendingImage}
            isSendingProduct={isSendingInventoryItem}
            isSendingInventoryItem={isSendingInventoryItem}
            isConnected={isConnected}
            onBackToList={() => setSelectedConversation('')}
            onClose={() => setIsOpen(false)}
            onMessageChange={handleInputChange}
            onSendMessage={handleSendMessage}
            onImageSelect={handleImageSelect}
            onSendImage={handleSendImage}
            onClearImage={handleClearImage}
            onToggleInventory={() => setShowInventory(!showInventory)}
          />

          {showInventory && (
            <InventoryPanel
              inventoryItems={inventoryItems}
              inventoryLoading={inventoryLoading}
              isSending={isSendingInventoryItem}
              onSendProduct={handleSendProduct}
              onClose={() => setShowInventory(false)}
            />
          )}

          {showInventory && (
            <MobileInventoryModal
              inventoryItems={inventoryItems}
              inventoryLoading={inventoryLoading}
              isSending={isSendingInventoryItem}
              onSendProduct={handleSendProduct}
              onClose={() => setShowInventory(false)}
            />
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default CustomerSellerChat;