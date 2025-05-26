export const SELLER_STATUS = {
  WAITING_REVIEW: "WaitingReview",
  APPROVED: "Approved",
  REJECTED: "Rejected",
} as const;

export type SellerStatus = typeof SELLER_STATUS[keyof typeof SELLER_STATUS];
