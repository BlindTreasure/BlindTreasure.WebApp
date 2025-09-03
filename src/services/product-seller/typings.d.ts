import {
  ProductSortBy,
  ProductType,
  Status,
  StockStatus,
  ProductStatus,
  PaymentStatus,
  OrderStatus,
  ShipmentStatus, 
  PaymentInfoStatus
} from "@/const/products";

export type GetProduct = {
  search?: string;
  categoryId?: string;
  productStatus?: ProductStatus;
  sortBy?: ProductSortBy;
  desc?: boolean;
  pageIndex: number;
  pageSize: number;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  realSellingPrice: number;
  listedPrice: number;
  totalStockQuantity: number;
  reservedInBlindBox: number;
  availableToSell: number;
  productStockStatus: StockStatus;
  height: number;
  material: string;
  productType: ProductType;
  brand: string;
  status: string;
  imageUrls: string[];
  sellerId: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TProductResponse = {
  result: Product[];
  count: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
};

export type CreateProductForm = {
  name: string;
  description: string;
  categoryId: string;
  realSellingPrice: number;
  listedPrice: number | null;
  totalStockQuantity: number;
  status: Status;
  height?: number;
  material?: string;
  productType?: ProductType | null;
  images?: (File | string)[];
};

export type UpdateInfor = {
  name: string;
  description: string;
  categoryId: string;
  realSellingPrice: number;
  listedPrice: number | null;
  totalStockQuantity: number;
  status: Status;
  height?: number;
  material?: string;
  productType?: ProductType | null;
};

export type GetOrderParams = {
  status?: PaymentStatus;
  placedFrom?: string;
  placedTo?: string;
  CheckoutGroupId?: string;
  pageIndex?: number;
  pageSize?: number;
  userId?: string;
  
};

export type OrderResponse = {
  result: Order[];
  count: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}
export interface Order {
  id: string;
  status: PaymentStatus;
  totalAmount: number;
  placedAt: string; 
  completedAt: string | null;
  shippingAddress: ShippingAddress | null;
  details: OrderDetail[];
  payment: Payment;
  finalAmount: number;
  totalShippingFee: number;
  checkoutGroupId: string;
  sellerId: string;
  seller: Seller | null;
}

export type ShippingAddress = {
  id: string;
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
};

export type OrderDetail = {
  id: string;
  logs: string;
  productId: string;
  orderId: string;
  productName: string;
  productImages: string[];
  blindBoxId?: string | null;
  blindBoxName?: string | null;
  blindBoxImage?: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: OrderStatus;
  shipments: Shipment[];
  inventoryItems: InventoryItem[];
  detailDiscountPromotion: number;
  finalDetailPrice: number;
};

export type Shipment = {
  id: string;
  orderDetailId: string;
  orderCode: string;
  totalFee: number;
  mainServiceFee: number;
  provider: string;
  trackingNumber: string;
  shippedAt: string;
  estimatedDelivery: string;
  status: ShipmentStatus;
  estimatedPickupTime: string;
};

export type Payment = {
  id: string;
  orderId: string;
  amount: number;
  discountRate: number;
  netAmount: number;
  method: string;
  status: PaymentInfoStatus;
  paymentIntentId?: string;
  paidAt: string | null;
  refundedAmount: number;
  transactions: PaymentTransaction[];
  sessionId: string;
};

export type PaymentTransaction = {
  id: string;
  type: "Checkout" | string;
  amount: number;
  currency: string;
  status: "Pending" | "Successful" | "Failed";
  occurredAt: string;
  externalRef: string;
  paymentId: string;
};