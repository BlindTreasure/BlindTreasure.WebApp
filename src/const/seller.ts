export const SELLER_STATUS = {
  WAITING_REVIEW: "WaitingReview",
  APPROVED: "Approved",
  REJECTED: "Rejected",
} as const;

export type SellerStatus = typeof SELLER_STATUS[keyof typeof SELLER_STATUS];

export enum StatisticRange {
  DAY = "Day",
  WEEK = "Week",
  MONTH = "Month",
  QUARTER = "Quarter",
  YEAR = "Year",
  CUSTOM = "Custom",
  TODAY = "Today",
}

export const StatisticRangeText: Record<StatisticRange, string> = {
  [StatisticRange.TODAY]: "Hôm nay",
  [StatisticRange.DAY]: "Ngày",
  [StatisticRange.WEEK]: "Tuần",
  [StatisticRange.MONTH]: "Tháng",
  [StatisticRange.QUARTER]: "Quý",
  [StatisticRange.YEAR]: "Năm",
  [StatisticRange.CUSTOM]: "Tùy chỉnh",
};

export enum StatusSeller {
  InfoEmpty = "InfoEmpty",
  WaitingReview = "WaitingReview",
  Approved = "Approved",
  Rejected = "Rejected",
}

export const StatusSellerText: Record<StatusSeller, string> = {
  [StatusSeller.InfoEmpty]: "Chưa có thông tin",
  [StatusSeller.WaitingReview]: "Chờ duyệt",
  [StatusSeller.Approved]: "Đã duyệt",
  [StatusSeller.Rejected]: "Bị từ chối",
};
