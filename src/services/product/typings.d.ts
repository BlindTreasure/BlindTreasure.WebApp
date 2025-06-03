import {
  ProductSortBy,
  ProductStatus,
  ProductType,
  Status,
} from "@/const/products";

export type GetAllProducts = {
  search?: string;
  categoryId?: string;
  productStatus?: ProductStatus;
  sellerId: string;
  sortBy?: ProductSortBy;
  desc?: boolean;
  pageIndex: number;
  pageSize: number;
};

export type AllProduct = {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  price: number;
  stock: number;
  status: string;
  imageUrl: string;
  sellerId: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TAllProductResponse = {
  result: AllProduct[];
  count: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
};


