'use client';
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
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
  clearMessages,
  removeConversation
} from '@/stores/chat-slice';
import { useSignalRMessages, useChatData, useChatActions } from '@/hooks/chat/useChat';
import { useChat } from '@/hooks/chat/use-send-message-user';
import useToast from '@/hooks/use-toast';

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
  const [hasShownSelfChatWarning, setHasShownSelfChatWarning] = useState(false);
  const hasSelectedRef = useRef(false);
  const { addToast } = useToast();
  
  const currentUserId = useAppSelector(state => state.userSlice?.user?.userId);
  
  // Kiểm tra self-chat và ngăn mở chat nếu cần
  const isSelfChat = useMemo(() => {
    return targetUserId && currentUserId && targetUserId === currentUserId;
  }, [targetUserId, currentUserId]);
  
  // Reset warning flag khi targetUserId thay đổi hoặc không còn self-chat
  useEffect(() => {
    if (!isSelfChat) {
      setHasShownSelfChatWarning(false);
    }
  }, [isSelfChat]);
  
  // Logic xử lý isOpen với kiểm tra self-chat
  const isOpen = useMemo(() => {
    if (isSelfChat) {
      return false;
    }
    return externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  }, [externalIsOpen, internalIsOpen, isSelfChat]);

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

  const { 
    isConnected, 
    userStatuses,
    typingUsers,
    isUserOnline,
    checkUserOnlineStatus,
    startTyping,
    stopTyping,
    clearTypingForUser
  } = useChat();

  useSignalRMessages();
  useChatData(isOpen);
  const chatActions = useChatActions();

  // Effect để check online status khi select conversation
  useEffect(() => {
    if (!targetUserId || !isOpen || isSelfChat || hasSelectedRef.current) return;
    
    const targetConversation = conversations.find(conv => conv.otherUserId === targetUserId);
    const newConversation = conversations.find(conv => conv.lastMessageTime == null);
    if (targetConversation) {
      if (newConversation && newConversation.otherUserId != targetConversation.otherUserId){
        dispatch(removeConversation(targetConversation.otherUserId))
      } 
      dispatch(setSelectedConversation(targetUserId));
      checkUserOnlineStatus(targetUserId);
      hasSelectedRef.current = true;
    }else if (conversations.length === 0) {
      chatActions.handleSelectConversation(targetUserId);
      checkUserOnlineStatus(targetUserId);
      hasSelectedRef.current = true;
    }
  }, [targetUserId, isOpen, conversations, isSelfChat]);

  // Effect để check online status cho tất cả conversations khi mở chat
  useEffect(() => {
    if (isOpen && conversations.length > 0 && !isSelfChat) {
      conversations.forEach(conv => {
        checkUserOnlineStatus(conv.otherUserId);
      });
    }
  }, [isOpen, conversations, checkUserOnlineStatus, isSelfChat]);

  // Effect để check online status khi chọn conversation mới
  useEffect(() => {
    if (selectedConversation && isConnected && !isSelfChat) {
      checkUserOnlineStatus(selectedConversation);
    }
  }, [selectedConversation, isConnected, checkUserOnlineStatus, isSelfChat]);

  // Effect để hiện thông báo khi phát hiện self-chat (chỉ hiện 1 lần)
  useEffect(() => {
    if (isSelfChat && !hasShownSelfChatWarning && (externalIsOpen || targetUserId)) {
      addToast({ 
        description: "Bạn không thể tự nhắn tin cho chính mình được!", 
        type: "error",
        duration: 4000 
      });
      setHasShownSelfChatWarning(true);
    }
  }, [isSelfChat, externalIsOpen, targetUserId, hasShownSelfChatWarning, addToast]);

  // Ổn định isUserOnline bằng useCallback
  const stableIsUserOnline = useCallback((userId: string) => {
    return userStatuses[userId]?.isOnline ?? false;
  }, [userStatuses]);

  const selectedConversationInfo = useMemo(() => {
    if (!selectedConversation || isSelfChat) return undefined;
    
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
    stableIsUserOnline,
    isSelfChat
  ]);

  const filteredConversations = useMemo(() => 
    conversations.filter(conv =>
      conv.otherUserName.toLowerCase().includes(searchQuery.toLowerCase())
    ).map(conv => ({
      ...conv,
      isOnline: stableIsUserOnline(conv.otherUserId)
    })), [conversations, searchQuery, stableIsUserOnline]
  );

  const displayUnreadCount = useMemo(() => {
    const conversationUnreadTotal = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
    return totalUnreadCount > 0 ? totalUnreadCount : conversationUnreadTotal;
  }, [totalUnreadCount, conversations]);

  // Enhanced conversation selection handler
  const handleSelectConversation = useCallback((userId: string) => {
    if (userId === currentUserId) {
      addToast({ 
        description: "Bạn không thể tự nhắn tin cho chính mình được!", 
        type: "error" 
      });
      return;
    }
    
    chatActions.handleSelectConversation(userId);
    // Check online status khi chọn conversation
    if (isConnected) {
      checkUserOnlineStatus(userId);
    }
  }, [chatActions, checkUserOnlineStatus, isConnected, currentUserId, addToast]);

  // Typing handlers
  const handleStartTyping = useCallback(() => {
    if (selectedConversation && isConnected && !isSelfChat) {
      startTyping(selectedConversation);
    }
  }, [selectedConversation, isConnected, startTyping, isSelfChat]);

  const handleStopTyping = useCallback(() => {
    if (selectedConversation && isConnected && !isSelfChat) {
      stopTyping(selectedConversation);
    }
  }, [selectedConversation, isConnected, stopTyping, isSelfChat]);

  // Enhanced send message handler
  const handleSendMessage = useCallback(() => {
    if (selectedConversation && !isSelfChat) {
      // Clear typing before sending
      clearTypingForUser(selectedConversation);
    }
    chatActions.handleSendMessage();
  }, [selectedConversation, clearTypingForUser, chatActions, isSelfChat]);

  const handleOpenChat = () => {
    if (isSelfChat) {
      if (!hasShownSelfChatWarning) {
        addToast({ 
          description: "Bạn không thể tự nhắn tin cho chính mình được!", 
          type: "error",
          duration: 4000 
        });
        setHasShownSelfChatWarning(true);
      }
      return;
    }
    setInternalIsOpen(true);
  };
  
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

  // Không render gì cả nếu là self-chat và đang cố gắng mở
  if (isSelfChat) {
    return null;
  }

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
            onSelectConversation={handleSelectConversation}
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
            onSendMessage={handleSendMessage}
            onImageSelect={chatActions.handleImageSelect}
            onSendImage={() => selectedImage && chatActions.handleSendImage(selectedImage)}
            onClearImage={chatActions.handleClearImage}
            onToggleInventory={handleToggleInventory}
            onStartTyping={handleStartTyping}
            onStopTyping={handleStopTyping}
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