import { ProductSortBy, ProductType, Status } from "@/const/products";

export type GetProduct = {
  search?: string;
  categoryId?: string;
  status?: string;
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
  stock: number;
  status: string;
  imageUrl: string;
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
  productImageUrl?: File;
};
