declare namespace REQUEST {
  type GetChatConversation = {
    pageIndex?: number;
    pageSize?: number;
  }

  type GetChatHistoryDetail = {
    receiverId: string;
    pageIndex?: number;
    pageSize?: number;
  }

  type SendImageToUser = {
    receiverId: string;
    imageFile: File;
  }

  type SendInventoryItemToUser = {
    receiverId: string;
    inventoryItemId: string;
    customMessage?: string;
  }
}

declare namespace API {
  type ChatConversation = {
    otherUserId: string;
    otherUserName: string;
    otherUserAvatar: string;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
    isOnline: boolean;
  }

  type ChatHistoryDetail = {
    id: string;
    senderId: string;
    receiverId: string;
    senderName: string;
    senderAvatar: string;
    content: string;
    sentAt: string;
    isRead: boolean;
    isCurrentUserSender: boolean;
    messageType: string;
    isImage: boolean
    fileUrl: string | null;
    fileName: string | null;
    fileSize: string | null;
    fileMimeType: string | null;
    inventoryItemId: string | null;
    inventoryItem: InventoryItem | null;
    isInventoryItem: boolean;
  }

  type InventoryItem = {
    id: string;
    productId: string;
    productName: string;
    image: string;
    location: string;
    tier: string;
    status: string;
    isFromBlindBox: boolean;
    isOnHold: boolean;
    hasActiveListing: boolean
  }

  type ResponseChatConversation = {
    result: ChatConversation[];
    count: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
  }

  type ResponseChatHistoryDetail = {
    result: ChatHistoryDetail[];
    count: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
  }
}
