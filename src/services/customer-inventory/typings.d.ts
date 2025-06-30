import { OrderStatus, PaymentInfoStatus, PaymentStatus, StockStatus, BlindboxStatus } from "@/const/products";

export type CustomerInventory = {
  id: string;
  userId: string;
  blindBoxId: string;
  blindBox: BlindBox;
  isOpened: boolean;
  createdAt: string;
  isDeleted: boolean;
  orderDetailId: string;
  orderDetail: OrderDetail;
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
  status: OrderStatusDetail;
};

