import {
  ChatHeader,
  EmptyState,
  LoadingSpinner,
  WelcomeScreen,
  MessageBubble,
  MessageInput
} from '@/components/seller-chat';

const SellerChatArea: React.FC<{
  selectedConversation: string;
  selectedConversationInfo?: any;
  messages: API.ChatHistoryDetail[];
  messageInput: string;
  loading?: boolean;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBackToList: () => void;
}> = ({
  selectedConversation,
  selectedConversationInfo,
  messages,
  messageInput,
  loading = false,
  onMessageChange,
  onSendMessage,
  onImageSelect,
  onBackToList
}) => {
  if (!selectedConversation) {
    return <WelcomeScreen />;
  }

  const displayName = selectedConversationInfo?.otherUserName || 'Khách hàng';
  const displayAvatar = selectedConversationInfo?.otherUserAvatar;
  const isOnline = selectedConversationInfo?.isOnline;

  return (
    <div className="flex-1 flex flex-col h-full">
      <ChatHeader
        displayName={displayName}
        displayAvatar={displayAvatar}
        isOnline={isOnline}
        onBackToList={onBackToList}
        showBackButton={true}
      />
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {loading ? (
          <LoadingSpinner message="Đang tải tin nhắn..." />
        ) : messages.length === 0 ? (
          <EmptyState type="messages" />
        ) : (
          <>
            {messages.map(msg => {
              return (
                <MessageBubble 
                  key={msg.id} 
                  message={msg}
                />
              );
            })}
            <div id="messages-end" />
          </>
        )}
      </div>
      <MessageInput
        messageInput={messageInput}
        onMessageChange={onMessageChange}
        onSendMessage={onSendMessage}
        onImageSelect={onImageSelect}
      />
    </div>
  );
};

export default SellerChatArea;