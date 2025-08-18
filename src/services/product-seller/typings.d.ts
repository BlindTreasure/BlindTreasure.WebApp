import {
  ProductSortBy,
  ProductType,
  Status,
  StockStatus,
  ProductStatus,
} from "@/const/products";

export type GetProduct = {
  search?: string;
  categoryId?: string;
  productStatus?: ProductStatus;
  sortBy?: ProductSortBy;
  desc?: boolean;
  pageIndex: number;
  pageSize: number;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  price: number;
  // stock: number;
  totalStockQuantity: number;
  reservedInBlindBox: number;
  availableToSell: number;
  productStockStatus: StockStatus;
  height: number;
  material: string;
  productType: ProductType;
  brand: string;
  status: string;
  imageUrls: string[];
  sellerId: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TProductResponse = {
  result: Product[];
  count: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
};

export type CreateProductForm = {
  name: string;
  description: string;
  categoryId: string;
  price: number;
  stock: number;
  status: Status;
  height?: number;
  material?: string;
  productType?: ProductType | null;
  brand?: string;
  images?: (File | string)[];
};

export type UpdateInfor = {
  name: string;
  description: string;
  categoryId: string;
  price: number;
  stock: number;
  height?: number;
  material?: string;
  productType?: ProductType | null;
  brand?: string;
};
