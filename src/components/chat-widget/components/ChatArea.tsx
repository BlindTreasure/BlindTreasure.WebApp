import { X, Download, FileText, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatMessage from "./ChatMessage";
import MessageInput from "./MessageInput";

interface ChatAreaProps {
  selectedConversation: string;
  selectedConversationInfo?: API.ChatConversation;
  messages: (API.ChatHistoryDetail & { isOptimistic?: boolean })[];
  messageInput: string;
  imagePreview: string | null;
  showInventory: boolean;
  chatHistoryLoading?: boolean;
  onBackToList: () => void;
  onClose: () => void;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSendImage: () => void;
  onClearImage: () => void;
  onToggleInventory: () => void;
}

export default function ChatArea({
  selectedConversation,
  selectedConversationInfo,
  messages,
  messageInput,
  imagePreview,
  showInventory,
  chatHistoryLoading = false,
  onBackToList,
  onClose,
  onMessageChange,
  onSendMessage,
  onImageSelect,
  onSendImage,
  onClearImage,
  onToggleInventory
}: ChatAreaProps) {
  // Handle file download
  const handleFileDownload = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  return (
    <div className={`flex-1 flex flex-col ${!selectedConversation ? 'hidden md:flex' : 'flex'}`}>
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToList}
              className="md:hidden p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium overflow-hidden">
              {displayAvatar && displayAvatar.startsWith('http') ? (
                <img src={displayAvatar} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <span>{displayAvatar}</span>
              )}
            </div>
            <div>
              <h4 className="font-medium">{displayName}</h4>
              <p className="text-xs text-gray-500">
                {selectedConversationInfo?.isOnline ? 'Đang hoạt động' : 'Không hoạt động'}
              </p>
            </div>
          </div>
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

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
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

              // Get display name for non-current user messages
              let messageSenderName = message.senderName;
              if (!message.isCurrentUserSender && selectedConversationInfo) {
                messageSenderName = selectedConversationInfo.otherUserName;
              }

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

                  {/* Message with proper alignment */}
                  <div className={`flex ${message.isCurrentUserSender ? 'justify-end' : 'justify-start'} mb-2`}>
                    <div className={`flex items-end gap-2 max-w-[70%] ${message.isCurrentUserSender ? 'flex-row-reverse' : 'flex-row'}`}>
                      {/* Avatar for other user's messages */}
                      {!message.isCurrentUserSender && (
                        <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium flex-shrink-0 overflow-hidden">
                          {selectedConversationInfo?.otherUserAvatar && selectedConversationInfo.otherUserAvatar.startsWith('http') ? (
                            <img src={selectedConversationInfo.otherUserAvatar} alt={messageSenderName} className="w-full h-full object-cover" />
                          ) : message.senderAvatar && message.senderAvatar.startsWith('http') ? (
                            <img src={message.senderAvatar} alt={messageSenderName} className="w-full h-full object-cover" />
                          ) : (
                            <span>{messageSenderName?.charAt(0).toUpperCase() || 'U'}</span>
                          )}
                        </div>
                      )}

                      {/* Message bubble */}
                      <div className={`relative px-4 py-2 rounded-2xl ${
                        message.isCurrentUserSender 
                          ? 'bg-green-500 text-white rounded-br-sm' 
                          : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                      } ${message.isOptimistic ? 'opacity-70' : ''}`}>
                        {/* Product info if exists */}
                        {message.productInfo && (
                          <div className="mb-2 p-3 bg-white bg-opacity-20 rounded-lg">
                            <div className="flex items-center gap-2">
                              {message.productInfo.imageUrl && (
                                <img 
                                  src={message.productInfo.imageUrl} 
                                  alt={message.productInfo.name}
                                  className="w-12 h-12 object-cover rounded-lg"
                                />
                              )}
                              <div>
                                <p className="font-medium text-sm">{message.productInfo.name}</p>
                                <p className="text-xs opacity-80">Sản phẩm</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Image handling - chỉ hiển thị ảnh nếu có fileUrl */}
                        {message.fileUrl && (
                          <div className="mb-2">
                            <img 
                              src={message.fileUrl} 
                              alt={message.fileName || "Hình ảnh"}
                              className="max-w-full h-auto rounded-lg max-h-60 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => window.open(message.fileUrl, '_blank')}
                            />
                            {/* Hiển thị tên file nếu có */}
                            {message.fileName && (
                              <p className="text-xs mt-1 opacity-70">
                                {message.fileName}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Message content - chỉ hiển thị nếu KHÔNG có fileUrl hoặc content không phải là default message */}
                        {message.content && 
                         message.content !== 'Đã gửi một hình ảnh' && 
                         message.content !== 'Đã gửi một sản phẩm' && 
                         !message.fileUrl && (
                          <p className="text-sm break-words">{message.content}</p>
                        )}

                        {/* Nếu có cả fileUrl và content khác default, hiển thị content như caption */}
                        {message.fileUrl && 
                         message.content && 
                         message.content !== 'Đã gửi một hình ảnh' && 
                         message.content !== 'Đã gửi một sản phẩm' && (
                          <p className="text-sm break-words mt-1">{message.content}</p>
                        )}

                        {/* Nếu không có fileUrl và không có productInfo, hiển thị content bình thường */}
                        {!message.fileUrl && !message.productInfo && message.content && (
                          <p className="text-sm break-words">{message.content}</p>
                        )}

                        {/* Timestamp and Read status */}
                        <div className={`text-xs mt-1 opacity-70 flex items-center gap-1 ${
                          message.isCurrentUserSender ? 'justify-end' : 'justify-start'
                        }`}>
                          <span>
                            {new Date(message.sentAt).toLocaleTimeString('vi-VN', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                          
                          {/* Read status for current user messages - only show if message is read */}
                          {message.isCurrentUserSender && message.isRead && (
                            <span className="ml-1">✓✓</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
      </div>

      <MessageInput
        messageInput={messageInput}
        imagePreview={imagePreview}
        showInventory={showInventory}
        onMessageChange={onMessageChange}
        onSendMessage={onSendMessage}
        onImageSelect={onImageSelect}
        onSendImage={onSendImage}
        onClearImage={onClearImage}
        onToggleInventory={onToggleInventory}
      />
    </div>
  );
}