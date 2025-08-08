import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type ChatConversation = {
  otherUserId: string;
  otherUserName: string;
  otherUserAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
}

interface ConversationListProps {
  conversations: ChatConversation[];
  selectedConversation: string;
  searchQuery: string;
  totalUnread: number;
  loading?: boolean;
  onSelectConversation: (id: string) => void;
  onSearchChange: (query: string) => void;
  onClose: () => void;
}

export default function ConversationList({
  conversations,
  selectedConversation,
  searchQuery,
  totalUnread,
  loading = false,
  onSelectConversation,
  onSearchChange,
  onClose
}: ConversationListProps) {
  const filteredConversations = conversations.filter(conv =>
    conv.otherUserName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`w-80 border-r bg-gray-50 flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'} md:w-80`}>
      <div className="p-4 border-b text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#d02a2a]">
            <h3 className="font-semibold">Chat</h3>
            {totalUnread > 0 && (
              <span className="text-[#d02a2a] text-xs">
                ({totalUnread})
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-600 hover:bg-gray-200 p-1 h-auto rounded-full"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 border-b bg-white">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Tìm theo tên"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 border-gray-200 focus:border-blue-400 focus:ring-blue-200"
            disabled={loading}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              <span className="text-sm text-gray-500">Đang tải cuộc trò chuyện...</span>
            </div>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="text-gray-400 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-sm text-gray-500">
                {searchQuery ? 'Không tìm thấy cuộc trò chuyện nào' : 'Chưa có cuộc trò chuyện nào'}
              </p>
            </div>
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <div
              key={conversation.otherUserId}
              onClick={() => onSelectConversation(conversation.otherUserId)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-100 transition-colors ${selectedConversation === conversation.otherUserId ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-sm font-medium text-white shadow-sm overflow-hidden">
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
                      {conversation.otherUserName || 'Unknown User'}
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
          ))
        )}
      </div>
    </div>
  );
}