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

export const ProductSortByText: Record<ProductSortBy, string> = {
  [ProductSortBy.CreatedAt]: "Ngày",
  [ProductSortBy.Name]: "Tên",
  [ProductSortBy.Price]: "Giá",
  [ProductSortBy.Stock]: "Số lượng hàng",
};

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

export const ProductStatusText: Record<ProductStatus, string> = {
  [ProductStatus.Active]: "Đang hoạt động",
  [ProductStatus.InActive]: "Chưa hoạt động",
  [ProductStatus.OutOfStock]: "Hết hàng",
  [ProductStatus.New]: "Hàng mới",
};

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
  Rare = "Rare",
  Epic = "Epic",
  Secret = "Secret",
}

export const RarityText: Record<Rarity, string> = {
  [Rarity.Common]: "Phổ biến",
  [Rarity.Rare]: "Cao cấp",
  [Rarity.Epic]: "Hiếm",
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
  SHIPPING_REQUESTED = "SHIPPING_REQUESTED",
  DELIVEREDING = "DELIVERING",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export const OrderStatusText: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "Chờ giao hàng",
  [OrderStatus.SHIPPING_REQUESTED]: "Yêu cầu vận chuyển",
  [OrderStatus.DELIVEREDING]: "Đang giao hàng",
  [OrderStatus.DELIVERED]: "Đã giao hàng",
  [OrderStatus.CANCELLED]: "Đã hủy",
};

export enum OrderStatusDetail {
  PENDING = "PENDING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  IN_INVENTORY = "IN_INVENTORY"
}

export const OrderStatusDetailText: Record<OrderStatusDetail, string> = {
  [OrderStatusDetail.PENDING]: "Chờ xác nhận",
  [OrderStatusDetail.SHIPPED]: "Đang vận chuyển",
  [OrderStatusDetail.DELIVERED]: "Đã giao hàng",
  [OrderStatusDetail.CANCELLED]: "Đã hủy",
  [OrderStatusDetail.IN_INVENTORY]: "Trong túi đồ",
};

export enum PaymentInfoStatus {
  Pending = "Pending",
  Paid = "Paid",
  Failed = "Failed",
  Cancelled = "Cancelled",
  Expired = "Expired",
  Completed = "Completed",
}

export const PaymentInfoStatusText: Record<PaymentInfoStatus, string> = {
  [PaymentInfoStatus.Pending]: "Chờ thanh toán",
  [PaymentInfoStatus.Cancelled]: "Đã hủy",
  [PaymentInfoStatus.Paid]: "Đã thanh toán",
  [PaymentInfoStatus.Failed]: "Thanh toán thất bại",
  [PaymentInfoStatus.Completed]: "Hoàn tất",
  [PaymentInfoStatus.Expired]: "Hết hạn",
};
