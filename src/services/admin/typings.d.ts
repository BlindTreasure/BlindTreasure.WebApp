import {
  ProductSortBy,
  ProductType,
  Status,
  StockStatus,
  ProductStatus,
  PaymentStatus,
  OrderStatus,
  ShipmentStatus,
  PaymentInfoStatus,
} from "@/const/products";

import { StatusSeller } from "@/const/seller";

export type GetOrderParams = {
  SellerId?: string;
  UserId?: string;
  status?: PaymentStatus;
  placedFrom?: string;
  placedTo?: string;
  CheckoutGroupId?: string;
  pageIndex?: number;
  pageSize?: number;
};

export type OrderResponse = {
  result: Order[];
  count: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
};
export interface Order {
  id: string;
  status: PaymentStatus;
  totalAmount: number;
  placedAt: string;
  completedAt: string | null;
  shippingAddress: ShippingAddress | null;
  details: OrderDetail[];
  payment: Payment;
  finalAmount: number;
  totalShippingFee: number;
  checkoutGroupId: string;
  sellerId: string;
  seller: Seller | null;
}

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
  detailDiscountPromotion: number;
  finalDetailPrice: number;
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
  estimatedPickupTime: string;
  pickedUpAt: string;
};

export type Payment = {
  id: string;
  orderId: string;
  amount: number;
  discountRate: number;
  netAmount: number;
  method: string;
  status: PaymentInfoStatus;
  paymentIntentId?: string;
  paidAt: string | null;
  refundedAmount: number;
  transactions: PaymentTransaction[];
  sessionId: string;
};

export type PaymentTransaction = {
  id: string;
  type: "Checkout" | string;
  amount: number;
  currency: string;
  status: "Pending" | "Successful" | "Failed";
  occurredAt: string;
  externalRef: string;
  paymentId: string;
};

export type Seller = {
  sellerId: string;
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  avatarUrl: string;
  status: string;
  companyName: string;
  taxId: string;
  companyAddress: string;
  coaDocumentUrl: string;
  sellerStatus: StatusSeller;
  isVerified: boolean;
  rejectReason: string | null;
  stripeAccountId: string | null;
};
