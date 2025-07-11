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

  type withdrawPromotion = {
    sellerId?: string;
    promotionId: string;
  }

  type GetPromotionParticipant = {
    promotionId: string;
    pageIndex?: number;
    pageSize?: number;
    desc?: boolean
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
    isParticipant? : boolean;
  }

  type ViewParticipantPromotion = {
    id: string;
    email: string;
    fullName: string;
    phone: string;
    companyName: string;
    taxId: string;
    companyAddress: string;
    isVerified: string;
    joinedAt: string
  }

  type ResponseDataViewParticipantPromotion = {
    result: ViewParticipantPromotion[];
    count: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
  } 

  type ParticipantPromotion = {
    id: string;
    promotionId: string;
    sellerId: string;
    joinedAt: string
  }

  type ResponseDataPromotion = {
    result: Promotion[];
    count: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
  };

  
}

