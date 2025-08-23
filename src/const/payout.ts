export enum PayoutStatus {
  PENDING = "PENDING",
  REQUESTED = "REQUESTED",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

export const PayoutStatusText: Record<PayoutStatus, string> = {
  [PayoutStatus.PENDING]: "Chờ xử lý",
  [PayoutStatus.REQUESTED]: "Người bán đã yêu cầu rút tiền",
  [PayoutStatus.PROCESSING]: "Đang xử lý",
  [PayoutStatus.COMPLETED]: "Hoàn tất",
  [PayoutStatus.FAILED]: "Thất bại",
  [PayoutStatus.CANCELLED]: "Hủy",
};