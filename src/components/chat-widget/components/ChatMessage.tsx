import { Package, Download, FileText, Image as ImageIcon, MapPin, Gift, Clock, Eye, Crown } from "lucide-react";

interface ChatMessageProps {
  message: API.ChatHistoryDetail;
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
  shouldShowOnlineDot?: boolean;
}

// Hàm kiểm tra URL có phải là ảnh không
const isImageUrl = (url: string): boolean => {
  if (!url) return false;
  const lowerUrl = url.toLowerCase();
  
  // Kiểm tra MinIO URL hoặc extension ảnh phổ biến
  return lowerUrl.includes('minio.fpt-devteam.fun') || 
         lowerUrl.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?|$)/i) !== null;
};

// Hàm lấy màu tier
const getTierColor = (tier?: string): string => {
  if (!tier) return '';
  
  const tierLower = tier.toLowerCase();
  
  if (tierLower.includes('secret') || tierLower.includes('huyền thoại') || tierLower.includes('ssr')) {
    return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
  }
  if (tierLower.includes('epic') || tierLower.includes('sử thi') || tierLower.includes('sr')) {
    return 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white';
  }
  if (tierLower.includes('rare') || tierLower.includes('hiếm') || tierLower.includes('r')) {
    return 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white';
  }
  if (tierLower.includes('common') || tierLower.includes('thường') || tierLower.includes('n')) {
    return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
  }
  
  return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
};

// Hàm format status text
const getStatusInfo = (status: string, isOnHold: boolean) => {
  // Ưu tiên isOnHold nếu true
  if (isOnHold) {
    return {
      text: 'Đang giữ',
      className: 'bg-orange-100 text-orange-700'
    };
  }

  // Mapping status
  switch (status.toLowerCase()) {
    case 'available':
      return {
        text: 'Có sẵn',
        className: 'bg-green-100 text-green-700'
      };
    case 'sold':
      return {
        text: 'Đã bán',
        className: 'bg-gray-100 text-gray-700'
      };
    case 'OnHold':
    case 'on_hold':
      return {
        text: 'Đang giữ',
        className: 'bg-orange-100 text-orange-700'
      };
    case 'processing':
      return {
        text: 'Đang xử lý',
        className: 'bg-yellow-100 text-yellow-700'
      };
    case 'reserved':
      return {
        text: 'Đã đặt trước',
        className: 'bg-blue-100 text-blue-700'
      };
    default:
      return {
        text: status || 'Không xác định',
        className: 'bg-gray-100 text-gray-700'
      };
  }
};

export default function ChatMessage({ 
  message, 
  selectedConversationInfo, 
  shouldShowOnlineDot = false 
}: ChatMessageProps) {
  console.log(message);
  
  
  const handleFileDownload = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName || 'download';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get display name for non-current user messages
  let messageSenderName = message.senderName;
  if (!message.isCurrentUserSender && selectedConversationInfo?.otherUserName) {
    messageSenderName = selectedConversationInfo.otherUserName;
  }

  // Kiểm tra xem message có phải là ảnh không
  const hasImageContent = message.content && isImageUrl(message.content);
  const hasFileUrl = message.fileUrl && isImageUrl(message.fileUrl);
  const isImageMessage = hasImageContent || hasFileUrl || message.isImage;
  
  // Lấy URL ảnh - ưu tiên fileUrl, sau đó content nếu là URL ảnh
  const imageUrl = message.fileUrl || (hasImageContent ? message.content : null);

  return (
    <div className={`flex ${message.isCurrentUserSender ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`flex items-end gap-2 max-w-[70%] ${message.isCurrentUserSender ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar for other user's messages */}
        {!message.isCurrentUserSender && (
          <div className="relative w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium flex-shrink-0 overflow-hidden">
            {selectedConversationInfo?.otherUserAvatar && selectedConversationInfo.otherUserAvatar.startsWith('http') ? (
              <img src={selectedConversationInfo.otherUserAvatar} alt={messageSenderName || 'User'} className="w-full h-full object-cover" />
            ) : message.senderAvatar && message.senderAvatar.startsWith('http') ? (
              <img src={message.senderAvatar} alt={messageSenderName || 'User'} className="w-full h-full object-cover" />
            ) : (
              <span>{messageSenderName?.charAt(0).toUpperCase() || 'U'}</span>
            )}
            {/* Online dot cho avatar trong message */}
            {shouldShowOnlineDot && !message.isCurrentUserSender && (
              <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-white" />
            )}
          </div>
        )}

        {/* Message bubble */}
        <div className={`relative px-4 py-2 rounded-2xl animate-in slide-in-from-${message.isCurrentUserSender ? 'right' : 'left'}-2 duration-300 ${
          message.isCurrentUserSender 
            ? 'bg-green-500 text-white rounded-br-sm' 
            : 'bg-gray-100 text-gray-800 rounded-bl-sm'
        }`}>
          {/* Inventory Item if exists */}
          {message.isInventoryItem && message.inventoryItem && (
            <div className="mb-2 p-3 bg-white bg-opacity-20 rounded-lg">
              <div className="flex items-start gap-3">
                {/* Product Image */}
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 relative">
                  {message.inventoryItem.image ? (
                    <img 
                      src={message.inventoryItem.image} 
                      alt={message.inventoryItem.productName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <Package className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Tier badge overlay trên ảnh */}
                  {message.inventoryItem.tier && (
                    <div className={`absolute top-1 left-1 px-1.5 py-0.5 rounded text-xs font-bold ${getTierColor(message.inventoryItem.tier)}`}>
                      <Crown className="w-2.5 h-2.5 inline mr-0.5" />
                      {message.inventoryItem.tier.toUpperCase()}
                    </div>
                  )}
                </div>
                
                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2 mb-1">
                        {message.inventoryItem.productName}
                      </h4>
                      
                      {/* Location */}
                      <div className="flex items-center gap-1 mb-2">
                        <MapPin className="w-3 h-3 opacity-60" />
                        <span className="text-xs opacity-80 truncate">
                          {message.inventoryItem.location}
                        </span>
                      </div>
                      
                      {/* Status - Ưu tiên hiển thị theo getStatusInfo */}
                      <div className="flex flex-wrap items-center gap-1 mb-1">
                        {(() => {
                          const statusInfo = getStatusInfo(message.inventoryItem.status, message.inventoryItem.isOnHold);
                          return (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${statusInfo.className}`}>
                              {statusInfo.text}
                            </span>
                          );
                        })()}
                      </div>
                      
                      {/* Additional Tags */}
                      <div className="flex flex-wrap items-center gap-1">
                        {message.inventoryItem.isFromBlindBox && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 flex items-center gap-1">
                            <Gift className="w-2.5 h-2.5" />
                            Blind Box
                          </span>
                        )}
                        
                        {/* Chỉ hiển thị tag "Đang giữ" phụ nếu status chính không phải là OnHold nhưng isOnHold = true */}
                        {message.inventoryItem.isOnHold && 
                         !['OnHold', 'on_hold'].includes(message.inventoryItem.status.toLowerCase()) && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            Đang giữ
                          </span>
                        )}
                        
                        {message.inventoryItem.hasActiveListing && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 flex items-center gap-1">
                            <Eye className="w-2.5 h-2.5" />
                            Đang rao
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Image handling - hiển thị ảnh nếu có imageUrl */}
          {isImageMessage && imageUrl && (
            <div className="mb-2">
              <div className="relative group">
                <img 
                  src={imageUrl} 
                  alt={message.fileName || "Hình ảnh"}
                  className="max-w-full h-auto rounded-lg max-h-80 object-cover cursor-pointer hover:opacity-90 transition-opacity shadow-sm"
                  onClick={() => window.open(imageUrl, '_blank')}
                  onError={(e) => {
                    // Fallback khi không load được ảnh
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback && fallback.classList.contains('hidden')) {
                      fallback.classList.remove('hidden');
                      fallback.style.display = 'flex';
                    }
                  }}
                />
                {/* Fallback UI khi ảnh không load được */}
                <div className="hidden items-center justify-center w-full h-32 bg-gray-200 rounded-lg">
                  <div className="text-center text-gray-500">
                    <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Không thể tải ảnh</p>
                  </div>
                </div>
                
                {/* Download button overlay */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFileDownload(imageUrl, message.fileName || 'image');
                  }}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-1.5 rounded-full"
                  title="Tải xuống"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
              
              {/* Hiển thị thông tin file nếu có */}
              {message.fileName && (
                <p className="text-xs opacity-70 mt-1 truncate max-w-[200px]">
                  {message.fileName}
                </p>
              )}
            </div>
          )}

          {/* File khác không phải ảnh */}
          {!isImageMessage && message.fileUrl && (
            <div className="mb-2 p-3 bg-white bg-opacity-20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white bg-opacity-30 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {message.fileName || 'Tệp đính kèm'}
                  </p>
                </div>
                <button
                  onClick={() => handleFileDownload(message.fileUrl!, message.fileName || 'file')}
                  className="p-1 hover:bg-white hover:bg-opacity-20 rounded"
                  title="Tải xuống"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Message content - logic đơn giản hơn, tránh duplicate */}
          {(() => {
            const isImageMessage = hasImageContent || hasFileUrl || message.isImage;
            
            // Không hiển thị content nếu:
            // 1. Là ảnh và content là URL ảnh
            // 2. Content là các message mặc định
            // 3. Content rỗng
            // 4. Là inventory item và không có additional content
            if (
              (isImageMessage && hasImageContent) ||
              message.content === 'Đã gửi một hình ảnh' || 
              message.content === '[Hình ảnh]' ||
              message.content === 'Đã gửi một sản phẩm' ||
              message.content === 'Đã gửi một tệp' ||
              message.content === 'Đã gửi một inventory item' ||
              message.content === '[Sản phẩm]' ||
              (message.isInventoryItem && !message.content?.trim()) ||
              !message.content ||
              !message.content.trim()
            ) {
              return null;
            }
            
            // Chỉ hiển thị content text thực sự
            return <p className="text-sm break-words">{message.content}</p>;
          })()}

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
            
            {/* Read status for current user messages */}
            {message.isCurrentUserSender && (
              <span className="ml-1">
                {message.isRead ? '✓✓' : '✓'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}