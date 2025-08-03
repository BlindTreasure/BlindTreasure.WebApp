import {
  OrderStatus,
  PaymentInfoStatus,
  PaymentStatus,
  ShipmentStatus,
} from "@/const/products";

export type OrderListApiData = {
  result: OrderResponse[];
  count: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
};

export type GetOrderParams = {
  status?: PaymentStatus;
  placedFrom?: string;
  placedTo?: string;
  pageIndex?: number;
  pageSize?: number;
};

export type OrderResponse = {
  id: string;
  status: PaymentStatus;
  totalAmount: number;
  placedAt: string;
  completedAt: string | null;
  shippingAddress?: ShippingAddress;
  details: OrderDetail[];
  payment?: PaymentInfo | null;
  finalAmount: number;
  totalShippingFee: number;
  promotionNote: string;
};

export type ShippingAddress = {
  id: string;
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
};

export type OrderDetail = {
  id: string;
  logs: string;
  productId: string;
  orderId: string;
  productName: string;
  productImages: string[];
  blindBoxId?: string | null;
  blindBoxName?: string | null;
  blindBoxImage?: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: OrderStatus;
  shipments: Shipment[];
  inventoryItems: InventoryItem[];
};

export type PaymentInfo = {
  id: string;
  orderId: string;
  amount: number;
  discountRate: number;
  netAmount: number;
  method: string;
  status: PaymentInfoStatus;
  transactionId: string;
  paymentIntentId?: string;
  paidAt: string | null;
  refundedAmount: number;
  transactions: PaymentTransaction[];
};

export type PaymentTransaction = {
  id: string;
  type: "Checkout" | string;
  amount: number;
  currency: string;
  status: "Pending" | "Success" | "Failed";
  occurredAt: string;
  externalRef: string;
};

export type Shipment = {
  id: string;
  orderDetailId: string;
  orderCode: string;
  totalFee: number;
  mainServiceFee: number;
  provider: string;
  trackingNumber: string;
  shippedAt: string;
  estimatedDelivery: string;
  status: ShipmentStatus;
};

export type OrderDetails = {
  id: string;
  logs: string;
  orderId: string;
  productId: string;
  productName: string;
  productImages: string[];
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: OrderStatus;
  shipments: Shipment[];
};
export type OrderDetailListResponse = {
  result: OrderDetails[];
  count: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
};

export type GetOrderDetailParams = {
  status?: OrderStatus;
  OrderId?: string;
  MinPrice?: number;
  MaxPrice?: number;
  IsBlindBox?: boolean;
  IsProduct?: boolean;
  PageIndex?: number;
  PageSize?: number;
};
