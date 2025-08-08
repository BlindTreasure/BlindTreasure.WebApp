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
}

export const StatisticRangeText: Record<StatisticRange, string> = {
  [StatisticRange.DAY]: "Ngày",
  [StatisticRange.WEEK]: "Tuần",
  [StatisticRange.MONTH]: "Tháng",
  [StatisticRange.QUARTER]: "Quý",
  [StatisticRange.YEAR]: "Năm",
  [StatisticRange.CUSTOM]: "Tùy chỉnh",
};
