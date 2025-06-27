export enum confirmStatus {
  Pending = 0,
  Approved = 1,
  Rejected = -1,
}

export enum ProductSortBy {
  CreatedAt = "CreatedAt",
  Name = "Name",
  Price = "Price",
  Stock = "Stock",
}

export enum ProductType {
  DirectSale = "DirectSale",
  BlindBoxOnly = "BlindBoxOnly",
  Both = "Both",
}

export const ProductTypeText: Record<ProductType, string> = {
  [ProductType.DirectSale]: "Bán trực tiếp",
  [ProductType.BlindBoxOnly]: "Chỉ bán blindbox",
  [ProductType.Both]: "Bán cả hai hình thức",
};

export enum Status {
  Active = "Active",
  InActive = "InActive",
}

export const StatusTypeText: Record<Status, string> = {
  [Status.Active]: "Đang hoạt động",
  [Status.InActive]: "Ngừng hoạt động",
};

export enum ProductStatus {
  Active = "Active",
  InActive = "InActive",
  New = "New",
  OutOfStock = "OutOfStock",
}

export enum BlindboxStatus {
  Draft = "Draft",
  PendingApproval = "PendingApproval",
  Approved = "Approved",
  Rejected = "Rejected",
}

export const BlindboxStatusText: Record<BlindboxStatus, string> = {
  [BlindboxStatus.Draft]: "Bản nháp",
  [BlindboxStatus.PendingApproval]: "Chờ duyệt",
  [BlindboxStatus.Approved]: "Đã duyệt",
  [BlindboxStatus.Rejected]: "Bị từ chối",
};

export enum Rarity {
  Common = "Common",
  Epic = "Epic",
  Rare = "Rare",
  Secret = "Secret",
}

export const RarityText: Record<Rarity, string> = {
  [Rarity.Common]: "Phổ biến",
  [Rarity.Epic]: "Cao cấp",
  [Rarity.Rare]: "Hiếm",
  [Rarity.Secret]: "Cực hiếm",
};

export const RarityColorClass: Record<Rarity, string> = {
  [Rarity.Common]: "bg-gray-100 text-gray-700",
  [Rarity.Rare]: "bg-blue-100 text-blue-700",
  [Rarity.Epic]: "bg-purple-100 text-purple-700",
  [Rarity.Secret]: "bg-yellow-100 text-yellow-700",
};

export enum StockStatus {
  InStock = "InStock",
  OutOfStock = "OutOfStock",
}

export const stockStatusMap: Record<StockStatus, string> = {
  [StockStatus.InStock]: "Còn hàng",
  [StockStatus.OutOfStock]: "Hết hàng",
};

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED",
  COMPLETED = "COMPLETED",
}

export const PaymentStatusText: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: "Chờ thanh toán",
  [PaymentStatus.CANCELLED]: "Đã hủy",
  [PaymentStatus.PAID]: "Đã thanh toán",
  [PaymentStatus.FAILED]: "Thanh toán thất bại",
  [PaymentStatus.COMPLETED]: "Hoàn tất",
  [PaymentStatus.EXPIRED]: "Hết hạn",
};

export enum OrderStatus {
  PENDING = "PENDING",
  SHIPPING = "SHIPPING",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export const OrderStatusText: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "Chờ xác nhận",
  [OrderStatus.SHIPPING]: "Đang vận chuyển",
  [OrderStatus.DELIVERED]: "Đã giao hàng",
  [OrderStatus.CANCELLED]: "Đã hủy",
};

export enum PaymentInfoStatus {
  PENDING = "Pending",
  PAID = "Paid",
  FAILED = "Failed",
  CANCELLED = "Cancelled",
  EXPIRED = "Expired",
  COMPLETED = "Completed",
}

export const PaymentInfoStatusText: Record<PaymentInfoStatus, string> = {
  [PaymentInfoStatus.PENDING]: "Chờ thanh toán",
  [PaymentInfoStatus.CANCELLED]: "Đã hủy",
  [PaymentInfoStatus.PAID]: "Đã thanh toán",
  [PaymentInfoStatus.FAILED]: "Thanh toán thất bại",
  [PaymentInfoStatus.COMPLETED]: "Hoàn tất",
  [PaymentInfoStatus.EXPIRED]: "Hết hạn",
};
