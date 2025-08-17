declare namespace SIGNALR {
  type ReceiveMessage = {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    isRead: boolean;
    timestamp: string;
  }

  type ReceiveMediaMessage = {
    id: string;
    senderId: string;
    receiverId: string;
    senderName: string;
    senderAvatar: string;
    content: string;
    fileName: string;
    fileSize: string;
    mimeType: string;
    messageType: string;
    timestamp: string;
    isRead: boolean;
  }

  type ReceiveInventoryItemMessage = {
    id: string;
    senderId: string;
    receiverId: string;
    senderName: string;
    senderAvatar: string;
    content: string;
    inventoryItemId: string;
    inventoryItem: InventoryItemDTO;
    messageType: string;
    timestamp: string;
    isRead: boolean;
  }

  type UserOnlineStatus = {
    userId: string;
    timestamp: string;
  }

  type InventoryItemDTO = {
    id: string;
    userId: string;
    productId: string;
    productName: string;
    image: string;
    createdAt: string;
    isFromBlindbox: boolean;
    sourceCustomerBlindBoxId: string;
    isOnHold: boolean;
    hasActiveListing: boolean;
    tier: string;
    status: string;
    location: string;
  }

  type UnboxLog = {
    customerBlindBoxId: string;
    customerName: string;
    productId: string;
    productName: string;
    rarity: string;
    dropRate: number;
    unboxAt: string;
    blindBoxName: string;
  }
}
