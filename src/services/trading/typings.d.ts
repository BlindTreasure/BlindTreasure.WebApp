declare namespace REQUEST {
  type OfferedInventory = {
    offeredInventoryIds? : string[]
  }

  type AcceptTradeRequest = {
    tradeRequestId: string;
    isAccepted: boolean;
  }

  type ViewTradingHistory = {
    finalStatus?: string;
    requesterId?: string;
    listingId?: string;
    completedFromDate?: string;
    completedToDate?: string;
    createdFromDate?: string;
    createdToDate?: string;
    sortBy?: string;
    pageIndex?: number;
    pageSize?: number;
    desc?: boolean;
  }
}

declare namespace API {
  type TradeRequest = {
    id: string;
    listingId: string;
    listingItemName: string;
    listingItemTier: string;
    listingItemImgUrl: string;
    listingOwnerName?: string;
    listingOwnerAvatarUrl: string;
    requesterId: string;
    requesterName: string;
    requesterAvatarUrl: string
    offeredItems: OfferedItem[];
    status: string;
    requestedAt: string;
    timeRemaining?: number;
    ownerLocked: boolean;
    requesterLocked: boolean;
  }
  type OfferedItem = {
    inventoryItemId: string;
    itemName: string;
    imageUrl: string;
    tier: string
  }

  type TradingHistory = {
    id: string;
    listingId: string;
    listingItemName: string;
    listingItemImage: string;
    requesterId: string;
    requesterName: string;
    offeredItemName: string;
    offeredItemImage: string;
    finalStatus: string;
    completedAt: string;
    createdAt: string;
  }

  type ResponseDataTradeHistory = {
    result: TradingHistory[];
    count: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
  };
}
