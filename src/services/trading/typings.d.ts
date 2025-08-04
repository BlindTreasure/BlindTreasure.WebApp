declare namespace REQUEST {
  type OfferedInventory = {
    offeredInventoryIds? : string[]
  }

  type AcceptTradeRequest = {
    tradeRequestId: string;
    isAccepted: boolean;
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
    requesterId: string;
    requesterName: string;
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
}
