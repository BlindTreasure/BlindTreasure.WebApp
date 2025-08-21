import { ListingStatus } from "@/const/listing"

export namespace REQUEST {
  type GetAllListing = {
    status?: ListingStatus;
    isFree?: boolean;
    isOwnerListings?: boolean;
    userId?: string;
    searchByName?: string;
    categoryId?: string;
    pageIndex?: number;
    pageSize?: number;
    desc?: boolean
  }

  type CreateListing = {
    inventoryId: string;
    isFree: boolean;
    description: string;
  }
}

export namespace API {
  type ListingItem = {
    id: string;
    inventoryId: string;
    productName: string;
    productImage: string;
    avatarUrl?: string;
    isFree: boolean;
    description: string;
    status: ListingStatus | string;
    listedAt: string;
    ownerId: string;
    ownerName: string;
  }

  type AvailableItem = {
    id: string;
    userId: string;
    productId: string;
    productName: string;
    image: string;
    location: string;
    status: string;
    createdAt: string;
    isFromBlindBox: boolean;
    sourceCustomerBlindBoxId: string;
    isOnHold: boolean;
    hasActiveListing: boolean;
  }

  type ListingCreated = {
    id: string;
    inventoryId: string;
    productName: string;
    productImage: string;
    isFree: boolean;
    description: string;
    status: string;
    listedAt: string;
    ownerName: string
  }

  type ListingItemResponse = {
    result: ListingItem[];
    count: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
  }
}

