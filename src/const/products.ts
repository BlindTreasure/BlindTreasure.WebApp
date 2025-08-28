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
  CANCELLED = "CANCELLED",
  PAID = "PAID",
  COMPLETED = "COMPLETED",
  EXPIRED = "EXPIRED",
}

export const PaymentStatusText: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: "Chờ thanh toán",
  [PaymentStatus.CANCELLED]: "Đã hủy",
  [PaymentStatus.PAID]: "Đã thanh toán",
  [PaymentStatus.COMPLETED]: "Hoàn tất",
  [PaymentStatus.EXPIRED]: "Hết hạn",
};

export enum OrderStatus {
  PENDING = "PENDING",
  IN_INVENTORY = "IN_INVENTORY",
  SHIPPING_REQUESTED = "SHIPPING_REQUESTED",
  PARTIALLY_SHIPPING_REQUESTED = "PARTIALLY_SHIPPING_REQUESTED",
  DELIVEREDING = "DELIVERING",
  PARTIALLY_DELIVERING = "PARTIALLY_DELIVERING",
  DELIVERED = "DELIVERED",
  PARTIALLY_DELIVERED = "PARTIALLY_DELIVERED",
  CANCELLED = "CANCELLED",
}

export const OrderStatusText: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "Chờ giao hàng",
  [OrderStatus.IN_INVENTORY]: "Trong túi đồ",
  [OrderStatus.SHIPPING_REQUESTED]: "Yêu cầu vận chuyển",
  [OrderStatus.PARTIALLY_SHIPPING_REQUESTED]: "Yêu cầu vận chuyển một phần",
  [OrderStatus.DELIVEREDING]: "Đang giao hàng",
  [OrderStatus.PARTIALLY_DELIVERING]: "Đang giao hàng một phần",
  [OrderStatus.DELIVERED]: "Đã giao hàng",
  [OrderStatus.PARTIALLY_DELIVERED]: "Giao hàng một phần",
  [OrderStatus.CANCELLED]: "Đã hủy",
};

export enum OrderStatusDetail {
  PENDING = "PENDING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  IN_INVENTORY = "IN_INVENTORY",
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

export enum ShipmentStatus {
  WAITING_PAYMENT = "WAITING_PAYMENT",
  PROCESSING = "PROCESSING",
  PICKED_UP = "PICKED_UP",
  IN_TRANSIT = "IN_TRANSIT",
  DELIVERED = "DELIVERED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export const ShipmentStatusText: Record<ShipmentStatus, string> = {
  [ShipmentStatus.WAITING_PAYMENT]: "Chờ thanh toán",
  [ShipmentStatus.PROCESSING]: "Đang xử lý",
  [ShipmentStatus.PICKED_UP]: "Đã lấy hàng",
  [ShipmentStatus.IN_TRANSIT]: "Đang vận chuyển",
  [ShipmentStatus.DELIVERED]: "Đã giao hàng",
  [ShipmentStatus.COMPLETED]: "Hoàn thành",
  [ShipmentStatus.CANCELLED]: "Đã hủy",
};

export enum InventoryItemStatus {
  Available = "Available",
  Shipment_requested = "Shipment_requested",
  Delivering = "Delivering",
  Listed = "Listed",
  Sold = "Sold",
  Delivered = "Delivered",
}

export const InventoryItemStatusText: Record<InventoryItemStatus, string> = {
  [InventoryItemStatus.Available]: "Còn hàng",
  [InventoryItemStatus.Shipment_requested]: "Yêu cầu vận chuyển",
  [InventoryItemStatus.Delivering]: "Đang vận chuyển",
  [InventoryItemStatus.Listed]: "Đã liệt kê",
  [InventoryItemStatus.Sold]: "Đã bán",
  [InventoryItemStatus.Delivered]: "Đã giao hàng",
};
