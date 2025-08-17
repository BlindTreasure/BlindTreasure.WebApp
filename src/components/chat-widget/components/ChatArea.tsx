import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";

interface ChatAreaProps {
  selectedConversation: string;
  selectedConversationInfo?: {
    otherUserId?: string;
    otherUserName?: string;
    otherUserAvatar?: string;
    lastMessage?: string;
    lastMessageTime?: string;
    unreadCount?: number;
    isOnline?: boolean;
    isTyping?: boolean;
    lastSeen?: string;
  };
  messages: API.ChatHistoryDetail[];
  messageInput: string;
  imagePreview: string | null;
  showInventory: boolean;
  chatHistoryLoading?: boolean;
  isSendingImage?: boolean;
  isSendingProduct?: boolean;
  isSendingInventoryItem?: boolean;
  isConnected?: boolean;
  onBackToList: () => void;
  onClose: () => void;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSendImage: () => void;
  onClearImage: () => void;
  onToggleInventory: () => void;
  onStartTyping?: () => void;
  onStopTyping?: () => void;
}

export default function ChatArea({
  selectedConversation,
  selectedConversationInfo,
  messages,
  messageInput,
  imagePreview,
  showInventory,
  chatHistoryLoading = false,
  isSendingImage = false,
  isSendingProduct = false,
  isSendingInventoryItem = false,
  isConnected = true,
  onBackToList,
  onClose,
  onMessageChange,
  onSendMessage,
  onImageSelect,
  onSendImage,
  onClearImage,
  onToggleInventory,
  onStartTyping,
  onStopTyping
}: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Function to scroll to bottom smoothly
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  // Auto scroll when messages change or when typing indicator appears/disappears
  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedConversationInfo?.isTyping, isSendingImage, isSendingProduct, isSendingInventoryItem]);

  // Show loading or empty state when no conversation is selected
  if (!selectedConversation) {
    return (
      <div className="flex-1 hidden md:flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium mb-2">Chọn một cuộc trò chuyện</p>
          <p className="text-sm">Chọn một người trong danh sách để bắt đầu nhắn tin</p>
        </div>
      </div>
    );
  }

  // Use conversation info from props, fallback to message-based info if not available
  let displayName = selectedConversationInfo?.otherUserName;
  let displayAvatar = selectedConversationInfo?.otherUserAvatar;
  
  // Fallback to getting info from messages if conversation info is not available
  if (!displayName) {
    const otherUserMessage = messages?.find(msg => !msg.isCurrentUserSender);
    displayName = otherUserMessage?.senderName || `User ${selectedConversation}`;
    displayAvatar = otherUserMessage?.senderAvatar || displayName.charAt(0).toUpperCase();
  }
  
  // Final fallback for avatar
  if (!displayAvatar) {
    displayAvatar = displayName.charAt(0).toUpperCase();
  }

  // Format online status text - chỉ hiển thị khi có trạng thái tích cực
  const getStatusText = () => {
    if (!selectedConversationInfo) return null;
    
    if (selectedConversationInfo.isTyping) {
      return "Đang soạn tin...";
    }
    
    if (selectedConversationInfo.isOnline) {
      return "Đang hoạt động";
    }
    
    // Có thể hiển thị last seen nếu gần đây (trong vòng 5 phút)
    if (selectedConversationInfo.lastSeen) {
      const lastSeenDate = new Date(selectedConversationInfo.lastSeen);
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - lastSeenDate.getTime()) / (1000 * 60));
      
      if (diffInMinutes < 5) {
        return "Vừa mới hoạt động";
      }
    }
    
    // Không hiển thị gì nếu không online và không có activity gần đây
    return null;
  };

  // Xác định có hiển thị chấm xanh không - chỉ hiển thị khi thực sự online hoặc đang typing
  const shouldShowOnlineDot = selectedConversationInfo?.isOnline === true || selectedConversationInfo?.isTyping === true;

  // Lấy status text và xác định màu
  const statusText = getStatusText();
  const getStatusColor = () => {
    if (selectedConversationInfo?.isTyping) return 'text-blue-600';
    if (selectedConversationInfo?.isOnline) return 'text-green-600';
    return 'text-gray-500';
  };

  return (
    <div className={`flex-1 flex flex-col ${!selectedConversation ? 'hidden md:flex' : ''}`}>
      {/* Header */}
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToList}
              className="md:hidden p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="relative w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium overflow-hidden">
              {displayAvatar && displayAvatar.startsWith('http') ? (
                <img src={displayAvatar} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <span>{displayAvatar}</span>
              )}
              {/* Online status dot */}
              {shouldShowOnlineDot && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>
            <div>
              <h4 className="font-medium">{displayName}</h4>
              {statusText && (
                <p className={`text-xs ${getStatusColor()}`}>
                  {statusText}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="hidden md:flex p-1 h-auto rounded-full hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      >
        {/* Loading state for chat history */}
        {chatHistoryLoading && (
          <div className="flex justify-center items-center p-8">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              <p className="text-sm text-gray-500">Đang tải tin nhắn...</p>
            </div>
          </div>
        )}

        {/* Show messages when not loading and messages exist */}
        {!chatHistoryLoading && messages && messages.length > 0 && (
          <>
            {messages.map((message, index) => {
              // Check if we need to show date separator
              const showDateSeparator = index === 0 || 
                new Date(message.sentAt).toDateString() !== new Date(messages[index - 1].sentAt).toDateString();

              return (
                <div key={message.id}>
                  {/* Date separator */}
                  {showDateSeparator && (
                    <div className="text-center my-4">
                      <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {new Date(message.sentAt).toLocaleDateString('vi-VN', { 
                          day: '2-digit', 
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  )}

                  {/* Use ChatMessage component */}
                  <ChatMessage 
                    message={message} 
                    selectedConversationInfo={selectedConversationInfo}
                    shouldShowOnlineDot={shouldShowOnlineDot && index === messages.length - 1}
                  />
                </div>
              );
            })}
            
            {/* Typing Indicator */}
            {selectedConversationInfo?.isTyping && (
              <div className="mb-4">
                <TypingIndicator 
                  userName={displayName}
                  userAvatar={displayAvatar}
                />
              </div>
            )}
            
            {/* Loading states */}
            {isSendingImage && (
              <div className="flex justify-end mb-2">
                <div className="flex items-end gap-2 max-w-[70%] flex-row-reverse">
                  <div className="relative px-4 py-3 rounded-2xl bg-green-500 text-white rounded-br-sm opacity-70">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span className="text-sm">Đang gửi ảnh...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isSendingProduct && (
              <div className="flex justify-end mb-2">
                <div className="flex items-end gap-2 max-w-[70%] flex-row-reverse">
                  <div className="relative px-4 py-3 rounded-2xl bg-green-500 text-white rounded-br-sm opacity-70">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span className="text-sm">Đang gửi sản phẩm...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isSendingInventoryItem && (
              <div className="flex justify-end mb-2">
                <div className="flex items-end gap-2 max-w-[70%] flex-row-reverse">
                  <div className="relative px-4 py-3 rounded-2xl bg-green-500 text-white rounded-br-sm opacity-70">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span className="text-sm">Đang gửi inventory item...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Empty state when no messages and not loading */}
        {!chatHistoryLoading && (!messages || messages.length === 0) && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p className="text-sm">Chưa có tin nhắn nào</p>
              <p className="text-xs mt-1">Gửi tin nhắn đầu tiên để bắt đầu cuộc trò chuyện</p>
            </div>
          </div>
        )}

        {/* Invisible element để scroll tới */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput
        messageInput={messageInput}
        imagePreview={imagePreview}
        showInventory={showInventory}
        isSendingImage={isSendingImage}
        isConnected={isConnected}
        onMessageChange={onMessageChange}
        onSendMessage={onSendMessage}
        onImageSelect={onImageSelect}
        onSendImage={onSendImage}
        onClearImage={onClearImage}
        onToggleInventory={onToggleInventory}
        onStartTyping={onStartTyping}
        onStopTyping={onStopTyping}
      />
    </div>
  );
}