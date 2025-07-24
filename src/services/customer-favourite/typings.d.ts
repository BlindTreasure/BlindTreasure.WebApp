export type RequestFavourite = {
  pageIndex?: number;
  pageSize?: number;
};

export type RequestAddFavourite = {
  productId?: string;
  blindBoxId?: string;
  type: "Product" | "BlindBox";
};

export type WishlistResponse = {
  result: WishlistItem[];
  count: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
};

export type WishlistItem = {
  id: string;
  userId: string;
  type: "Product" | "BlindBox";
  createdAt: string;
  productId?: string;
  blindBoxId?: string;
  product?: Product;
  blindBox?: BlindBox;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  price: number;
  stock: number;
  productStockStatus: StockStatus;
  productType: ProductType;
  status: string;
  imageUrls: string[];
  sellerId: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type BlindBox = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  totalQuantity: number;
  blindBoxStockStatus: StockStatus;
  categoryName: string;
  imageUrl: string;
  releaseDate: string;
  createdAt: string;
  status: BlindboxStatus;
  hasSecretItem: boolean;
  secretProbability: number;
  isDeleted: boolean;
};
