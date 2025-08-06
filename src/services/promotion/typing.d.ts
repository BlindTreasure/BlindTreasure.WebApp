import { PromotionStatus, DiscountType } from "@/const/promotion";

export type TGetPromotion = {
  search?: string;
  status?: PromotionStatus;
  isParticipated?: boolean;
  participantSellerId?: string;
  pageIndex?: number;
  pageSize?: number;
};

export type Promotion = {
  id: string;
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  status: PromotionStatus;
  sellerId?: string;
  createdByRole: string;
  isDeleted: boolean;
};

export type RPromotion = {
  result: Promotion[];
  count: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
};
