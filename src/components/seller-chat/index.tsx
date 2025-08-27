'use client';
import React from 'react';
import { Search, ArrowLeft, Send, Package, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type ChatMessage = {
  id: string;
  content: string;
  sentAt: string;
  isCurrentUserSender: boolean;
  senderName: string;
  senderAvatar: string;
  messageType: 'text' | 'image';
  imageUrl?: string;
}

// UI Components
export const ChatHeader: React.FC<{
  displayName: string;
  displayAvatar?: string;
  isOnline?: boolean;
  onBackToList: () => void;
  showBackButton?: boolean;
}> = ({ displayName, displayAvatar, isOnline, onBackToList, showBackButton = false }) => (
  <div className="p-4 border-b bg-white shadow-sm">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {showBackButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackToList}
            className="lg:hidden p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium overflow-hidden">
            {displayAvatar ? (
              <img src={displayAvatar} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              displayName.charAt(0).toUpperCase()
            )}
          </div>
          {isOnline && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          )}
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{displayName}</h3>
          <p className="text-xs text-gray-500">
            {isOnline ? 'Đang hoạt động' : 'Không hoạt động'}
          </p>
        </div>
      </div>
    </div>
  </div>
);

export const ConversationListHeader: React.FC<{
  totalUnread: number;
}> = ({ totalUnread }) => (
  <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-white">
        <h2 className="text-xl font-bold">Tin nhắn</h2>
        {totalUnread > 0 && (
          <Badge className="bg-red-500 text-white text-xs">
            {totalUnread > 99 ? '99+' : totalUnread}
          </Badge>
        )}
      </div>
    </div>
  </div>
);

export const SearchInput: React.FC<{
  searchQuery: string;
  onSearchChange: (query: string) => void;
  loading?: boolean;
}> = ({ searchQuery, onSearchChange, loading = false }) => (
  <div className="p-4 border-b bg-gray-50">
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <Input
        placeholder="Tìm kiếm khách hàng..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 border-gray-200 focus:border-blue-400 focus:ring-blue-200"
        disabled={loading}
      />
    </div>
  </div>
);

export const ConversationItem: React.FC<{
  conversation: API.ChatConversation;
  isSelected: boolean;
  onClick: () => void;
}> = ({ conversation, isSelected, onClick }) => (
  <div
    onClick={onClick}
    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
      isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
    }`}
  >
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-sm font-medium text-white shadow-sm overflow-hidden">
          {conversation.otherUserAvatar ? (
            <img 
              src={conversation.otherUserAvatar} 
              alt={conversation.otherUserName}
              className="w-full h-full object-cover"
            />
          ) : (
            conversation.otherUserName?.charAt(0)?.toUpperCase() || '?'
          )}
        </div>
        {conversation.isOnline && (
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm truncate text-gray-900">
            {conversation.otherUserName || 'Khách hàng'}
          </h4>
          <span className="text-xs text-gray-500 flex-shrink-0">
            {conversation.lastMessageTime || ''}
          </span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm text-gray-600 truncate">
            {conversation.lastMessage || 'Chưa có tin nhắn'}
          </p>
          {conversation.unreadCount > 0 && (
            <Badge className="bg-red-500 text-white text-xs min-w-[20px] h-5 rounded-full flex items-center justify-center ml-2 flex-shrink-0">
              {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </div>
  </div>
);

export const EmptyState: React.FC<{
  type: 'conversations' | 'messages' | 'search';
  searchQuery?: string;
}> = ({ type }) => {
  const renderContent = () => {
    switch (type) {
      case 'conversations':
        return <p className="text-sm text-gray-500">Chưa có tin nhắn từ khách hàng</p>;
      case 'search':
        return <p className="text-sm text-gray-500">Không tìm thấy cuộc trò chuyện nào</p>;
      case 'messages':
        return <p className="text-sm text-gray-500">Chưa có tin nhắn nào</p>;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">{renderContent()}</div>
    </div>
  );
};

export const LoadingSpinner: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex items-center justify-center p-8">
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      <span className="text-sm text-gray-500">{message}</span>
    </div>
  </div>
);

export const WelcomeScreen: React.FC = () => (
  <div className="flex-1 flex items-center justify-center bg-gray-50">
    <div className="text-center text-gray-500">
      <p className="text-xl font-medium mb-2">Chào mừng đến với tin nhắn của seller</p>
      <p className="text-sm">Chọn một cuộc trò chuyện để bắt đầu hỗ trợ khách hàng</p>
    </div>
  </div>
);

export const MessageBubble: React.FC<{ message: API.ChatHistoryDetail }> = ({ message }) => {
  const isOwn = message.isCurrentUserSender;
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex items-end gap-2 max-w-[70%] ${isOwn ? 'flex-row-reverse' : ''}`}>
        {!isOwn && (
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium overflow-hidden">
            {message.senderAvatar ? (
              <img src={message.senderAvatar} alt={message.senderName} className="w-full h-full object-cover" />
            ) : (
              message.senderName.charAt(0).toUpperCase()
            )}
          </div>
        )}
        <div className={`relative px-4 py-3 rounded-2xl ${
          isOwn ? 'bg-blue-500 text-white rounded-br-sm' : 'bg-gray-100 text-gray-900 rounded-bl-sm'
        }`}>
          {message.messageType === 'image' && message.fileUrl && (
            <div className="mb-2">
              <img src={message.fileUrl} alt="Shared" className="max-w-full h-auto rounded-lg" />
            </div>
          )}
          {message.content && <p className="text-sm break-words">{message.content}</p>}
          <span className={`text-xs mt-1 block ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
            {new Date(message.sentAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export const MessageInput: React.FC<{
  messageInput: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ messageInput, onMessageChange, onSendMessage, onImageSelect }) => (
  <div className="p-4 bg-white border-t">
    <div className="flex items-end gap-2">
      <div className="flex gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={onImageSelect}
          className="hidden"
          id="image-upload"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => document.getElementById('image-upload')?.click()}
          className="p-2"
          title="Gửi hình ảnh"
        >
          <Package className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex-1 flex gap-2">
        <Input
          placeholder="Nhập tin nhắn..."
          value={messageInput}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
          className="flex-1"
        />
        <Button onClick={onSendMessage} className="px-4">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  </div>
);
