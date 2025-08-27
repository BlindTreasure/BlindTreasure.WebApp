import React from 'react';
import {
  ConversationListHeader,
  SearchInput,
  ConversationItem,
  EmptyState,
  LoadingSpinner,
} from '@/components/seller-chat';

interface SellerConversationListProps {
  conversations: API.ChatConversation[];
  selectedConversation: string;
  searchQuery: string;
  totalUnread: number;
  loading?: boolean;
  onSelectConversation: (id: string) => void;
  onSearchChange: (query: string) => void;
}

const SellerConversationList: React.FC<SellerConversationListProps> = ({
  conversations,
  selectedConversation,
  searchQuery,
  totalUnread,
  loading = false,
  onSelectConversation,
  onSearchChange,
}) => {
  const filtered = conversations.filter((conv) =>
    conv.otherUserName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-80 border-r bg-white flex flex-col h-full">
      {/* Header */}
      <ConversationListHeader totalUnread={totalUnread} />

      {/* Search box */}
      <SearchInput
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        loading={loading}
      />

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <LoadingSpinner message="Đang tải cuộc trò chuyện..." />
        ) : filtered.length === 0 ? (
          <EmptyState type={searchQuery ? 'search' : 'conversations'} />
        ) : (
          filtered.map((conv) => (
            <ConversationItem
              key={conv.otherUserId}
              conversation={conv}
              isSelected={selectedConversation === conv.otherUserId}
              onClick={() => onSelectConversation(conv.otherUserId)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default SellerConversationList;
