import { Rarity } from "@/const/products";

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
