import {
  BlindboxStatus,
  ProductSortBy,
  ProductType,
  Rarity,
  Status,
} from "@/const/products";

export type GetBlindBoxes = {
  search?: string;
  SellerId: string;
  categoryId?: string;
  status: string;
  minPrice?: number;
  maxPrice?: number;
  ReleaseDateFrom: string;
  ReleaseDateTo: string;
  pageIndex: number;
  pageSize: number;
};

export type BlindBoxItem = {
  productId: string;
  productName: string;
  quantity: number;
  dropRate: number;
  rarity: string;
  imageUrl: string;
};

export type BlindBox = {
  id: string;
  name: string;
  description: string;
  price: number;
  totalQuantity: number;
  imageUrl: string;
  releaseDate: string;
  status: BlindboxStatus;
  hasSecretItem: boolean;
  secretProbability: number;
  items: BlindBoxItem[];
  rejectReason?: string;
};

export type BlindBoxListResponse = {
  result: BlindBox[];
  count: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
};

export type CreateBlindboxForm = {
  name: string;
  price: number;
  totalQuantity?: number;
  releaseDate?: string;
  description: string;
  imageFile?: string | File | null;
  hasSecretItem?: boolean;
  secretProbability?: number;
};

export type BlindBoxItemRequest = {
  productId: string;
  quantity: number;
  dropRate: number;
  rarity: Rarity;
};

export type BlindBoxReviewRequest = {
  approve: boolean;
  rejectReason?: string;
}

export type BlindBoxItemsRequest = BlindBoxItemRequest[];

type CreateBlindboxItemsParam = {
  blindboxesId: string;
  items: BlindBoxItemRequest[]; 
};

type ReviewBlindboxParams = {
  blindboxesId: string;
  reviewData: BlindBoxReviewRequest;
}