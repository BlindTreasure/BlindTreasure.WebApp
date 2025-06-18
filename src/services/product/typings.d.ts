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
  minPrice?: number;
  maxPrice?: number;
  releaseDateFrom?: string;
  releaseDateTo?: string;
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
  height: number;
  material: string;
  productType: string;
  brand: string;
  status: string;
  imageUrls: string[];
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


