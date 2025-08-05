export enum PromotionStatus {
  Approved = "Approved",
  Pending = "Pending",
  Rejected = "Rejected",
}

export const PromotionStatusText: Record<PromotionStatus, string> = {
  [PromotionStatus.Approved]: "Đã duyệt",
  [PromotionStatus.Pending]: "Chờ duyệt",
  [PromotionStatus.Rejected]: "Bị từ chối",
};

export enum DiscountType {
  Percentage = "Percentage",
  Fixed = "Fixed",
}

export const DiscountTypeText: Record<DiscountType, string> = {
  [DiscountType.Percentage]: "Phần trăm",
  [DiscountType.Fixed]: "Giá cố định",
};
