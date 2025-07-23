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

export type GetBlindboxInventoryParams = {
  pageIndex?: number;
  pageSize?: number;
  isOpened?: boolean;
};

export type CustomerInventory = {
  id: string;
  userId: string;
  blindBoxId: string;
  blindBox: BlindBox;
  isOpened: boolean;
  createdAt: string;
  openedAt: string;
  isDeleted: boolean;
  orderDetailId?: string;
  orderDetail?: OrderDetail;
};

export type BlindBox = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  totalQuantity: number;
  blindBoxStockStatus: StockStatus;
  imageUrl: string;
  releaseDate: string;
  createdAt: string;
  status: BlindboxStatus;
  hasSecretItem: boolean;
  secretProbability: number;
  isDeleted: boolean;
};

export type OrderDetail = {
  id: string;
  blindBoxId: string;
  blindBoxName: string;
  blindBoxImage: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: OrderStatus;
};

export type GetBlindboxInventoryResponse = TResponseData<
  PaginatedResponse<CustomerInventory>
>;

export type InventoryItem = {
  id: string;
  title: string;
  image: string;
  status?: "unopened" | "opened" | null;
  type: "blindbox" | "product";
  price?: number;
  description?: string;
  blindBoxId?: string;
  userId?: string;
  createdAt?: string;
  isDeleted?: boolean;
};

export type CustomerItemInventory = {
  id: string;
  userId: string;
  itemId: string;
  item: Item;
  quantity: number;
  createdAt: string;
  isDeleted: boolean;
  orderDetailId?: string;
  orderDetail?: OrderDetail;
};

export type Item = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  totalQuantity: number;
  itemStockStatus: StockStatus;
  imageUrl: string;
  releaseDate: string;
  createdAt: string;
  status: BlindboxStatus;
  isDeleted: boolean;
  rarity: string;
  blindBoxId: string;
  blindBox: BlindBox;
};

export type GetItemInventoryResponse = TResponseData<
  PaginatedResponse<CustomerItemInventory>
>;
