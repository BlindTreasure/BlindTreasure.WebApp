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
  pageIndex?: number;
  pageSize?: number;
};

export type BlindBoxItem = {
  productId: string;
  productName: string;
  quantity: number;
  dropRate: number;
  rarity:  Rarity;
  imageUrl: string;
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
  releaseDate: string;
  createdAt: string;
  status: BlindboxStatus;
  hasSecretItem: boolean;
  secretProbability: number;
  items: BlindBoxItem[];
  isDeleted: boolean;
  rejectReason?: string;
};

// export type BlindBoxDetail = {
//   id: string;
//   categoryId: string;
//   name: string;
//   description: string;
//   price: number;
//   totalQuantity: number;
//   blindBoxStockStatus: StockStatus;
//   brand: string;
//   imageUrl: string;
//   releaseDate: string;
//   status: BlindboxStatus;
//   hasSecretItem: boolean;
//   secretProbability: number;
//   rejectReason: string;
//   isDeleted: boolean;
//   items: BlindBoxItem[];
// };

export type BlindBoxListResponse = {
  result: BlindBox[];
  count: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
};

export type CreateBlindboxForm = {
  name: string;
  price?: number;
  totalQuantity?: number;
  releaseDate?: string;
  categoryId: string;
  brand: string;
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