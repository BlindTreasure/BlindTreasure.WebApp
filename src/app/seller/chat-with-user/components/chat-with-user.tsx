'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/stores/store';
import { 
  setSearchQuery,
  setSelectedConversation,
  clearMessages
} from '@/stores/chat-slice';
import { useChat } from '@/hooks/chat/use-send-message-user';
import { useSignalRMessages, useChatData, useChatActions } from '@/hooks/chat/useChat';
import SellerConversationList from '@/components/seller-chat/components/seller-conversationlist'
import SellerChatArea from '@/components/seller-chat/components/seller-chat-area'

const SellerChatPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    conversations,
    messages,
    selectedConversation,
    searchQuery,
    messageInput,
    totalUnreadCount,
    loading
  } = useAppSelector(state => state.chatSlice);

  const { userStatuses, typingUsers } = useChat();
  useSignalRMessages();
  useChatData(true);
  const chatActions = useChatActions();

  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobileView(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const selectedConversationInfo = useMemo(() => {
    if (!selectedConversation) return undefined;
    const base = conversations.find(c => c.otherUserId === selectedConversation);
    if (!base) return undefined;
    return {
      ...base,
      isOnline: userStatuses[selectedConversation]?.isOnline ?? false,
      isTyping: typingUsers[selectedConversation]?.isTyping ?? false
    };
  }, [conversations, selectedConversation, userStatuses, typingUsers]);

  const handleBackToList = () => {
    if (isMobileView) {
      dispatch(setSelectedConversation(''));
      dispatch(clearMessages());
    }
  };

  return (
    <div className="h-[calc(100vh-96px)] flex bg-white">
      <div className={`${isMobileView && selectedConversation ? 'hidden' : 'block'} lg:block`}>
        <SellerConversationList
          conversations={conversations}
          selectedConversation={selectedConversation}
          searchQuery={searchQuery}
          totalUnread={totalUnreadCount}
          loading={loading.conversations}
          onSelectConversation={chatActions.handleSelectConversation}
          onSearchChange={(q) => dispatch(setSearchQuery(q))}
        />
      </div>
      <div className={`flex-1 ${isMobileView && !selectedConversation ? 'hidden' : 'block'} lg:block`}>
        <SellerChatArea
          selectedConversation={selectedConversation}
          selectedConversationInfo={selectedConversationInfo}
          messages={messages}
          messageInput={messageInput}
          loading={loading.messages}
          onMessageChange={chatActions.handleInputChange}
          onSendMessage={chatActions.handleSendMessage}
          onImageSelect={chatActions.handleImageSelect}
          onBackToList={handleBackToList}
        />
      </div>
    </div>
  );
};

export default SellerChatPage;
