'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSelector } from 'react-redux';
import useGetAllItemInventory from '@/app/(user)/inventory/hooks/useGetItemInventory';
import useGetChatConversation from '@/hooks/use-get-conversation-list';
import useGetUnreadCount from '@/hooks/use-get-unread-count';
import useGetChatHistoryDetail from '@/hooks/use-get-chat-history-detail';
import { useChat } from '@/hooks/use-send-message-user';
import { useServiceMarkMessageAsRead } from '@/services/chat/services';
import { InventoryItem } from '@/services/inventory-item/typings';
import { InventoryItemStatus } from '@/const/products';
import { TooltipProvider } from '../ui/tooltip';
import { IoChatbubblesOutline } from "react-icons/io5";
import ConversationList from './components/ConversationList';
import ChatArea from './components/ChatArea';
import InventoryPanel from './components/InventoryPanel';
import MobileInventoryModal from './components/MobileInventoryModal';
import { MessageType } from '@/const/chat'

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
  const currentUser = useSelector((state: any) => state.userSlice?.user);
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

  // Initialize useChat hook
  const { isConnected, messages: realTimeMessages, sendMessage, addMessage } = useChat();

  // Initialize mark as read hook with callback to update local state
  const markAsReadMutation = useServiceMarkMessageAsRead((fromUserId: string) => {
    // Cập nhật unread count trong conversations ngay lập tức
    setConversations(prev => prev.map(conv => 
      conv.otherUserId === fromUserId 
        ? { ...conv, unreadCount: 0 }
        : conv
    ));
    
    // Cập nhật total unread count
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

  // Get selected conversation info
  const selectedConversationInfo = conversations.find(conv => conv.otherUserId === selectedConversation);

  // Sync real-time messages from useChat with component messages
  useEffect(() => {
    if (realTimeMessages.length > 0 && selectedConversation && currentUserId) {
      const relevantMessages = realTimeMessages
        .filter(msg => 
          msg.receiverId === selectedConversation || msg.senderId === selectedConversation
        );
      
      relevantMessages.forEach(msg => {
        const transformedMessage: API.ChatHistoryDetail = {
          id: `realtime-${Date.now()}-${Math.random()}`,
          senderId: msg.senderId,
          senderName: msg.senderId,
          senderAvatar: '',
          receiverId: msg.receiverId,
          content: msg.content,
          sentAt: msg.timestamp,
          isCurrentUserSender: msg.senderId === currentUserId,
          isRead: false,
          messageType: MessageType.UserToUser,
          isImage: false, // Default to false for real-time messages
          fileUrl: undefined,
          fileName: undefined,
          fileSize: undefined,
          fileMimeType: undefined
        };
        
        // Avoid duplicates - check if message with same content and timestamp already exists
        setMessages(prev => {
          const isDuplicate = prev.some(existingMsg => 
            existingMsg.content === transformedMessage.content &&
            existingMsg.sentAt === transformedMessage.sentAt &&
            existingMsg.senderId === transformedMessage.senderId
          );
          
          if (isDuplicate) {
            return prev;
          }
          
          return [...prev, transformedMessage];
        });
      });
    }
  }, [realTimeMessages, selectedConversation, currentUserId]);

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
            isImage: msg.isImage || false,
            fileUrl: msg.fileUrl,
            fileName: msg.fileName,
            fileSize: msg.fileSize,
            fileMimeType: msg.fileMimeType,
            productInfo: msg.productInfo ? {
              id: msg.productInfo.id,
              name: msg.productInfo.name,
              imageUrl: msg.productInfo.imageUrl,
            } : undefined,
            imageUrl: msg.fileUrl
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
    }
  }, [selectedConversation, chatHistoryFetched]);

  // Fetch unread count when component mounts and periodically
  useEffect(() => {
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
  }, [getUnreadCountApi]);

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
          const transformedConversations: API.ChatConversation[] = conversationsResponse.value.data.result.map((conv: any) => ({
            otherUserId: conv.otherUserId,
            otherUserName: conv.otherUserName || 'Unknown User',
            otherUserAvatar: conv.avatarUrl || conv.otherUserAvatar || '',
            lastMessage: conv.lastMessage || '',
            lastMessageTime: conv.lastMessageTime ? new Date(conv.lastMessageTime).toLocaleDateString('vi-VN') : '',
            unreadCount: conv.unreadCount || 0,
            isOnline: conv.isOnline || false,
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
    
    // Tìm conversation được chọn
    const selectedConv = conversations.find(conv => conv.otherUserId === conversationId);
    
    // Nếu conversation có unread messages, đánh dấu đã đọc
    if (selectedConv && selectedConv.unreadCount > 0) {
      markAsReadMutation.mutate({ fromUserId: conversationId });
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation || !isConnected) return;

    // DON'T add optimistic update here - let SignalR handle it
    const messageContent = messageInput.trim();
    setMessageInput(''); // Clear input immediately

    try {
      // Only call sendMessage - don't add to local state
      await sendMessage(selectedConversation, messageContent);
    } catch (error) {
      console.error('Failed to send message:', error);
      // On error, restore the message input
      setMessageInput(messageContent);
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
    if (!selectedImage || !imagePreview || !selectedConversation || !isConnected) return;

    // Clear image immediately
    setSelectedImage(null);
    setImagePreview(null);
    const fileInput = document.getElementById('image-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';

    try {
      // Only call sendMessage - don't add to local state
      await sendMessage(selectedConversation, 'Đã gửi một hình ảnh');
    } catch (error) {
      console.error('Failed to send image:', error);
      // Could restore image preview on error if needed
    }
  };

  const handleSendProduct = async (item: InventoryItem) => {
    if (!selectedConversation || !isConnected) return;

    try {
      // Only call sendMessage - don't add to local state  
      await sendMessage(selectedConversation, 'Đã gửi một sản phẩm');
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

  // Debug log to check current user ID
  console.log('Current User ID:', currentUserId);

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
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
            onBackToList={() => setSelectedConversation('')}
            onClose={() => setIsOpen(false)}
            onMessageChange={setMessageInput}
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
              onSendProduct={handleSendProduct}
              onClose={() => setShowInventory(false)}
            />
          )}

          {showInventory && (
            <MobileInventoryModal
              inventoryItems={inventoryItems}
              inventoryLoading={inventoryLoading}
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