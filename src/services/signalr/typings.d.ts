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
    Id: string;
    UserId: string;
    ProductId: string;
    ProductName: string;
    Image: string;
    CreatedAt: string;
    IsFromBlindbox: boolean;
    SourceCustomerBlindBoxId: string;
    IsOnHold: boolean;
    HasActiveListing: boolean;
    Tier: string;
    Status: string;
    Location: string;
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

  type ReceiveMessageByAi = {
    senderId: string;
    receiverId: string;
    content: string;
    timestamp: string;
  }
}
