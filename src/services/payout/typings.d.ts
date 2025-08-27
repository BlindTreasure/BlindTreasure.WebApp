import { Rarity } from "@/const/products";
import { PeriodType } from "@/const/payout";

export type SellerPayoutSummary = {
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
  stripeAccountId: string;
  grossAmount: number;
  platformFeeRate: number;
  platformFeeAmount: number;
  netAmount: number;
  totalOrderDetails: number;
  totalOrders: number;
  canPayout: boolean;
  payoutBlockReason: string | null;
  orderDetailSummaries: OrderDetailSummary[];
};

export type OrderDetailSummary = {
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
  periodStart: string;
  periodEnd: string;
  periodType: PeriodType;
  grossAmount: number;
  netAmount: number;
  platformFeeAmount: number;
  status: PayoutStatus;
  createdAt: string;
  processedAt: string | null;
  completedAt: string | null;
  stripeTransferId: string | null;
  stripeTransferId: string | null;
  failureReason: string | null;
  retryCount: number;
  nextRetryAt: string;
  payoutDetails: PayoutDetail[];
  payoutLogs: PayoutLog[];
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
