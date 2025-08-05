import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  avatar?: string;
  isOnline: boolean;
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: string;
  searchQuery: string;
  totalUnread: number;
  onSelectConversation: (id: string) => void;
  onSearchChange: (query: string) => void;
  onClose: () => void;
}

export default function ConversationList({
  conversations,
  selectedConversation,
  searchQuery,
  totalUnread,
  onSelectConversation,
  onSearchChange,
  onClose
}: ConversationListProps) {
  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
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
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {filteredConversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => onSelectConversation(conversation.id)}
            className={`p-4 border-b cursor-pointer hover:bg-gray-100 transition-colors ${selectedConversation === conversation.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                  {conversation.avatar || conversation.name.charAt(0).toUpperCase()}
                </div>
                {conversation.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm truncate">{conversation.name}</h4>
                  <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                  {conversation.unreadCount > 0 && (
                    <Badge className="bg-red-500 text-white text-xs min-w-[20px] h-5 rounded-full flex items-center justify-center ml-2">
                      {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
