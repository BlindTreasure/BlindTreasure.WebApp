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
    fileUrl?: string;
    fileName?: string;
    fileSize?: string;
    fileMimeType?: string;
    productInfo?: ProductInfo;
  }

  type ProductInfo = {
    id: string;
    name: string;
    imageUrl: string;
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
