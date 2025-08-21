'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppSelector, useAppDispatch } from '@/stores/store';
import { TooltipProvider } from '../ui/tooltip';
import { IoChatbubblesOutline } from "react-icons/io5";
import ConversationList from './components/ConversationList';
import ChatArea from './components/ChatArea';
import InventoryPanel from './components/InventoryPanel';
import MobileInventoryModal from './components/MobileInventoryModal';
import { 
  setShowInventory, 
  setSelectedConversation, 
  setSearchQuery,
  clearMessages 
} from '@/stores/chat-slice';
import { useSignalRMessages, useChatData, useChatActions } from '@/hooks/chat/useChat';
import { useChat } from '@/hooks/chat/use-send-message-user';

export interface CustomerSellerChatProps {
  isOpen?: boolean;
  onClose?: () => void;
  targetUserId?: string;
}

const CustomerSellerChat: React.FC<CustomerSellerChatProps> = ({ 
  isOpen: externalIsOpen,
  onClose: externalOnClose,
  targetUserId 
}) => {
  const dispatch = useAppDispatch();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  
  const {
    conversations,
    messages,
    selectedConversation,
    searchQuery,
    messageInput,
    showInventory,
    inventoryItems,
    selectedImage,
    imagePreview,
    totalUnreadCount,
    loading
  } = useAppSelector(state => state.chatSlide);

  const currentUserId = useAppSelector(state => state.userSlice?.user?.userId);

  const { 
    isConnected, 
    userStatuses,
    typingUsers,
    isUserOnline,
    checkUserOnlineStatus 
  } = useChat();

  useSignalRMessages();
  useChatData(isOpen);
  const chatActions = useChatActions();

  useEffect(() => {
    if (!targetUserId || !isOpen || selectedConversation === targetUserId) return;

    const targetConversation = conversations.find(conv => conv.otherUserId === targetUserId);
    
    if (targetConversation) {
      dispatch(setSelectedConversation(targetUserId));
    } else if (conversations.length > 0) {
      chatActions.handleSelectConversation(targetUserId);
    }
  }, [targetUserId, isOpen, conversations, selectedConversation, dispatch]);

  // Ổn định isUserOnline bằng useCallback
  const stableIsUserOnline = useCallback((userId: string) => {
    return userStatuses[userId]?.isOnline ?? false;
  }, [userStatuses]);

  const selectedConversationInfo = useMemo(() => {
    if (!selectedConversation) return undefined;
    
    const baseInfo = conversations.find(conv => conv.otherUserId === selectedConversation);
    if (!baseInfo) return undefined;

    return {
      ...baseInfo,
      isOnline: stableIsUserOnline(selectedConversation),
      isTyping: typingUsers[selectedConversation]?.isTyping ?? false
    };
  }, [
    selectedConversation, 
    conversations, 
    userStatuses, 
    typingUsers, 
    stableIsUserOnline
  ]);

  const filteredConversations = useMemo(() => 
    conversations.filter(conv =>
      conv.otherUserName.toLowerCase().includes(searchQuery.toLowerCase())
    ), [conversations, searchQuery]
  );

  const displayUnreadCount = useMemo(() => {
    const conversationUnreadTotal = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
    return totalUnreadCount > 0 ? totalUnreadCount : conversationUnreadTotal;
  }, [totalUnreadCount, conversations]);

  const handleOpenChat = () => setInternalIsOpen(true);
  
  const handleCloseChat = () => {
    if (externalOnClose) {
      externalOnClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  const handleBackToList = () => {
    dispatch(setSelectedConversation(''));
    dispatch(clearMessages());
  };

  const handleToggleInventory = () => {
    dispatch(setShowInventory(!showInventory));
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={handleOpenChat}
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
        <div className={`bg-white rounded-lg shadow-2xl border h-[600px] flex overflow-hidden animate-in slide-in-from-bottom-4 max-w-[95vw] max-h-[95vh] transition-all duration-300 ${
          showInventory ? 'w-[1200px] md:max-w-[1200px]' : 'w-[800px] md:max-w-[800px]'
        }`}>
          <ConversationList
            conversations={filteredConversations}
            selectedConversation={selectedConversation}
            searchQuery={searchQuery}
            totalUnread={displayUnreadCount}
            loading={loading.conversations}
            onSelectConversation={chatActions.handleSelectConversation}
            onSearchChange={(query) => dispatch(setSearchQuery(query))}
            onClose={handleCloseChat}
          />
          <ChatArea
            selectedConversation={selectedConversation}
            selectedConversationInfo={selectedConversationInfo}
            messages={messages}
            messageInput={messageInput}
            imagePreview={imagePreview}
            showInventory={showInventory}
            chatHistoryLoading={loading.messages}
            isSendingImage={false}
            isSendingProduct={false}
            isSendingInventoryItem={false}
            isConnected={isConnected}
            onBackToList={handleBackToList}
            onClose={handleCloseChat}
            onMessageChange={chatActions.handleInputChange}
            onSendMessage={chatActions.handleSendMessage}
            onImageSelect={chatActions.handleImageSelect}
            onSendImage={() => selectedImage && chatActions.handleSendImage(selectedImage)}
            onClearImage={chatActions.handleClearImage}
            onToggleInventory={handleToggleInventory}
          />
          {showInventory && (
            <InventoryPanel
              inventoryItems={inventoryItems}
              inventoryLoading={loading.inventory}
              isSending={false}
              onSendProduct={chatActions.handleSendProduct}
              onClose={() => dispatch(setShowInventory(false))}
            />
          )}
          {showInventory && (
            <MobileInventoryModal
              inventoryItems={inventoryItems}
              inventoryLoading={loading.inventory}
              isSending={false}
              onSendProduct={chatActions.handleSendProduct}
              onClose={() => dispatch(setShowInventory(false))}
            />
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default CustomerSellerChat;