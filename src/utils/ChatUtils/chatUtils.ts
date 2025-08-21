// utils/chatUtils.ts
import { MessageType } from '@/const/chat';

export const transformSignalRMessage = (
  msg: SIGNALR.ReceiveMessage | SIGNALR.ReceiveMediaMessage | SIGNALR.ReceiveInventoryItemMessage,
  type: 'text' | 'media' | 'inventory',
  currentUserId?: string
): API.ChatHistoryDetail => {
  const baseMessage: API.ChatHistoryDetail = {
    id: msg.id || `realtime-${Date.now()}-${Math.random()}`,
    senderId: msg.senderId,
    senderName: ('senderName' in msg) ? msg.senderName || '' : '',
    senderAvatar: ('senderAvatar' in msg) ? msg.senderAvatar || '' : '',
    receiverId: msg.receiverId,
    content: msg.content || '',
    sentAt: msg.timestamp,
    isCurrentUserSender: msg.senderId === currentUserId,
    isRead: msg.isRead,
    messageType: MessageType.UserToUser,
    isImage: false,
    fileUrl: null,
    fileName: null,
    fileSize: null,
    fileMimeType: null,
    inventoryItemId: null,
    inventoryItem: null,
    isInventoryItem: false
  };

  if (type === 'media') {
    const mediaMsg = msg as SIGNALR.ReceiveMediaMessage;
    const isImageFile = mediaMsg.mimeType?.startsWith('image/') || 
                       mediaMsg.fileName?.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/);
    
    const messageType = mediaMsg.messageType ? 
      (mediaMsg.messageType as MessageType) : 
      (isImageFile ? MessageType.ImageMessage : MessageType.VideoMessage);
    
    return {
      ...baseMessage,
      messageType,
      isImage: messageType === MessageType.ImageMessage,
      fileUrl: msg.content,
      fileName: mediaMsg.fileName,
      fileSize: mediaMsg.fileSize,
      fileMimeType: mediaMsg.mimeType
    };
  }

  if (type === 'inventory') {
    const inventoryMsg = msg as SIGNALR.ReceiveInventoryItemMessage;
    
    return {
      ...baseMessage,
      messageType: inventoryMsg.messageType ? 
        (inventoryMsg.messageType as MessageType) : 
        MessageType.InventoryItemMessage,
      isInventoryItem: true,
      inventoryItemId: inventoryMsg.inventoryItem.Id,
      inventoryItem: {
        id: inventoryMsg.inventoryItem.Id,
        productId: inventoryMsg.inventoryItem.ProductId,
        productName: inventoryMsg.inventoryItem.ProductName,
        image: inventoryMsg.inventoryItem.Image,
        tier: inventoryMsg.inventoryItem.Tier,
        location: inventoryMsg.inventoryItem.Location,
        status: inventoryMsg.inventoryItem.Status,
        isFromBlindBox: inventoryMsg.inventoryItem.IsFromBlindbox,
        isOnHold: inventoryMsg.inventoryItem.IsOnHold,
        hasActiveListing: inventoryMsg.inventoryItem.HasActiveListing 
      }
    };
  }

  return baseMessage;
};

export const isMessageRelevant = (
  message: SIGNALR.ReceiveMessage | SIGNALR.ReceiveMediaMessage | SIGNALR.ReceiveInventoryItemMessage,
  selectedConversation: string,
  currentUserId?: string
): boolean => {
  return (
    (message.receiverId === selectedConversation && message.senderId === currentUserId) ||
    (message.senderId === selectedConversation && message.receiverId === currentUserId)
  );
};

export const generateLastMessagePreview = (
  messageType: 'text' | 'media' | 'inventory',
  content?: string,
  mediaInfo?: { mimeType?: string; fileName?: string }
): string => {
  switch (messageType) {
    case 'text':
      return content || '';
    case 'media':
      if (mediaInfo?.mimeType?.startsWith('image/') || 
          mediaInfo?.fileName?.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/)) {
        return 'Đã gửi một hình ảnh';
      }
      return 'Đã gửi một video';
    case 'inventory':
      return 'Đã gửi một inventory item';
    default:
      return '';
  }
};

export const formatConversationDate = (dateString: string | null): string => {
  if (!dateString) return '';
  
  try {
    return new Date(dateString).toLocaleDateString('vi-VN');
  } catch {
    return '';
  }
};

export const getSenderInfoFromMessages = (
  senderId: string, 
  messages: API.ChatHistoryDetail[]
): { senderName: string; senderAvatar: string } => {
  const previousMessage = messages
    .slice()
    .reverse()
    .find(msg => msg.senderId === senderId && msg.senderName && msg.senderAvatar);
  
  return {
    senderName: previousMessage?.senderName || '',
    senderAvatar: previousMessage?.senderAvatar || ''
  };
};

export const isDuplicateMessage = (
  newMessage: API.ChatHistoryDetail,
  existingMessages: API.ChatHistoryDetail[]
): boolean => {
  return existingMessages.some(existingMsg =>
    existingMsg.id === newMessage.id ||
    (existingMsg.content === newMessage.content &&
     existingMsg.sentAt === newMessage.sentAt &&
     existingMsg.senderId === newMessage.senderId)
  );
};

export const CHAT_CONSTANTS = {
  TYPING_TIMEOUT: 1000,
  UNREAD_REFRESH_INTERVAL: 30000,
  DEFAULT_PAGE_SIZE: 50,
  CONVERSATION_PAGE_SIZE: 20,
  INVENTORY_PAGE_SIZE: 50,
} as const;

export const isImageFile = (mimeType?: string, fileName?: string): boolean => {
  return mimeType?.startsWith('image/') || 
         fileName?.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/) !== null;
};

export const isVideoFile = (mimeType?: string, fileName?: string): boolean => {
  return mimeType?.startsWith('video/') || 
         fileName?.toLowerCase().match(/\.(mp4|avi|mov|wmv|flv|webm)$/) !== null;
};