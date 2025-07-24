import { ListingStatus } from "@/const/listing"

export namespace REQUEST {
  type GetAllListing = {
    status?: ListingStatus;
    isFree?: boolean;
    pageIndex?: number;
    pageSize?: number;
    desc?: boolean
  }
}

export namespace API {
  type ListingItem = {
    id: string;
    productName: string;
    productImage: string;
    isFree: boolean;
    description: string;
    status: ListingStatus;
    listedAt: string;
  }

  type ListingItemResponse = {
    result: ListingItem[];
    count: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
  }
}

