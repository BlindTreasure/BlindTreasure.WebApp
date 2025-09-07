import {
  BlindboxStatus,
  ProductSortBy,
  ProductType,
  Rarity,
  Status,
  StockStatus,
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
  HasItem?: boolean;
  pageIndex: number;
  pageSize: number;
};

export type BlindBoxItem = {
  productId: string;
  productName: string;
  quantity: number;
  dropRate: number;
  rarity:  Rarity;
  imageUrl: string;
  weight: number;
};

export type BlindBox = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  totalQuantity: number;
  blindBoxStockStatus: StockStatus;
  brand: string;
  imageUrl: string;
  tierWeights: Object<RarityName, number> | null;
  releaseDate: string;
  createdAt: string;
  status: BlindboxStatus;
  hasSecretItem: boolean;
  secretProbability: number;
  items: BlindBoxItem[];
  isDeleted: boolean;
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
  categoryId: string;
  description: string;
  imageFile?: string | File | null;
};

export type BlindBoxItemRequest = {
  productId: string;
  quantity: number;
  weight: number;
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

type RarityName = "Common" | "Rare" | "Epic" | "Secret"