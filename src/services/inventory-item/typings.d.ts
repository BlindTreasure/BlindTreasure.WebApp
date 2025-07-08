import {
  OrderStatus,
  PaymentInfoStatus,
  PaymentStatus,
  StockStatus,
  BlindboxStatus,
} from "@/const/products";
import { TResponseData } from "@/typings";

export type PaginatedResponse<T> = {
  result: T[];
  count: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
};

export type InventoryItem = {
  id: string;
  userId: string;
  productId: string;
  product: Product;
  quantity: number;
  location: string;
  status: Status;
  createdAt: string;
  isFromBlindBox: boolean;
  sourceCustomerBlindBoxId: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  price: number;
  stock: number;
  productStockStatus: StockStatus;
  height: number;
  material: string;
  productType: ProductType;
  brand: string;
  status: Status;
  imageUrls: string[];
  sellerId: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type GetItemInventoryResponse = TResponseData<
  PaginatedResponse<InventoryItem>
>;

export type GetItemInventoryParams = {
  pageIndex?: number;
  pageSize?: number;
};
