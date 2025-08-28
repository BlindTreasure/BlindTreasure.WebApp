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
import { PayoutStatus, PeriodType } from "@/const/payout";

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

export type GetInventoryOnHoldParams = {
  pageIndex?: number;
  pageSize?: number;
  userId?: string;
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

export type PayoutHistoryParams = {
  status?: PayoutStatus;
  SellerId?: string;
  PeriodStart?: string;
  PeriodEnd?: string;
  PageIndex?: number;
  PageSize?: number;
};

export type PayoutHistoryResponse = {
  result: PayoutHistoryItem[];
  count: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
};

export type PayoutHistoryItem = {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
  platformFeeRate: number;
  stripeDestinationAccount: string;
  notes: string | null;
  nextRetryAt: string | null;
  payoutDetails: PayoutDetail[];
  payoutLogs: PayoutLog[];
  periodStart: string;
  periodEnd: string;
  periodType: "WEEKLY" | "MONTHLY";
  grossAmount: number;
  netAmount: number;
  platformFeeAmount: number;
  status: PayoutStatus;
  createdAt: string;
  processedAt: string;
  completedAt: string;
  stripeTransferId: string;
  failureReason: string | null;
  retryCount: number;
  proofImageUrls: string[];
};

export type PayoutDetail = {
  orderDetailId: string;
  orderId: string;
  quantity: number;
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  refundAmount: number;
  contributedAmount: number;
  orderCompletedAt: string;
};

export type PayoutLog = {
  id: string;
  fromStatus: PayoutStatus;
  toStatus: PayoutStatus;
  action: string;
  details: string;
  errorMessage: string | null;
  triggeredByUserName: string;
  loggedAt: string;
};

export type ConfirmPayoutRequest = {
  files: File[];
};

export type InventoryOnHold = {
  id: string;
  product: Product;
  status: string;
  holdInfo: HoldInfo;
};

type Product = {
  id: string;
  name: string;
  description: string;
  brand: string;
};

type HoldInfo = {
  isOnHold: boolean;
  holdUntil: string;
  remainingDays: number;
  lastTradeId: string | null;
};

export type InventoryOnHoldResponse = {
  result: InventoryOnHold[];
  count: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
};

export type StripeTransactionResponse = {
  result: StripeTransaction[];
  count: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
};

export type StripeTransaction = {
  id: string;
  payoutId: string;
  payout: Payout;
  sellerId: string;
  sellerName: string;
  stripeTransferId: string;
  stripeDestinationAccount: string;
  stripeBalanceTransactionId: string | null;
  amount: number;
  currency: string;
  status: string;
  transferredAt: string;
  description: string;
  failureReason: string | null;
  initiatedBy: string;
  initiatedByName: string;
  externalRef: string;
  batchId: string | null;
  platformRevenueOfPayoutAmount: number | null;
};

export type Payout = {
  id: string;
  sellerId: string;
  sellerName: string;
  periodStart: string;
  periodEnd: string;
  periodType: PeriodType;
  grossAmount: number;
  netAmount: number;
  platformFeeAmount: number;
  status: PayoutStatus;
  createdAt: string;
  processedAt: string;
  completedAt: string | null;
  stripeTransferId: string;
  failureReason: string | null;
  retryCount: number;
  proofImageUrls: string[];
};

export type TransactionsParams = {
  sellerId?: string; 
  transferredFrom?: string;
  transferredTo?: string; 
  minAmount?: number;
  maxAmount?: number;
  isInitiatedBySystem?: boolean;
  pageIndex?: number;
  pageSize?: number;
  desc?: boolean;
};
