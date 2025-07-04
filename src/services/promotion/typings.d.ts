declare namespace REQUEST {
  type PromotionForm = {
    code: string;
    description: string;
    discountType: PromotionType;
    discountValue: number;
    startDate: string;
    endDate: string;
    usageLimit: number
  }

  type GetPromotion = {
    status?: PromotionStatus;
    sellerId?: string;
    pageIndex?: number;
    pageSize?: number;
  }

  type ReviewPromotion = {
    promotionId: string;
    isApproved: boolean;
    rejectReason: string;
  }
}

declare namespace API {
  type Promotion = {
    id: string;
    code: string;
    description: string;
    discountType: PromotionType;
    discountValue: number;
    startDate: string;
    endDate: string;
    usageLimit: number;
    status: PromotionStatus
    sellerId?: string;
    createdByRole: PromotionCreateByRole;
    updateAt?: string;
    rejectReason?: string;
  }

  type ResponseDataPromotion = {
    result: Promotion[];
    count: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
  };
}

