import {
  OrderStatus,
  PaymentInfoStatus,
  PaymentStatus,
  StockStatus,
  BlindboxStatus,
  ShipmentStatus,
  InventoryItemStatus,
} from "@/const/products";
import { TResponseData } from "@/typings";

export type PaginatedResponse<T> = {
  result: T[];
  count: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
};

export type InventoryItem = {
  id: string;
  userId: string;
  productId: string;
  product: Product;
  quantity: number;
  location: string;
  status: InventoryItemStatus;
  createdAt: string;
  isFromBlindBox: boolean;
  sourceCustomerBlindBoxId: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  price: number;
  stock: number;
  productStockStatus: StockStatus;
  height: number;
  material: string;
  productType: ProductType;
  brand: string;
  status: Status;
  imageUrls: string[];
  sellerId: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type GetItemInventoryResponse = TResponseData<
  PaginatedResponse<InventoryItem>
>;

export type GetItemInventoryParams = {
  pageIndex?: number;
  pageSize?: number;
  status?: string;
};

export type RequestShipment = {
  inventoryItemIds: string[];
};

export type PreviewShipment = {
  inventoryItemIds: string[];
};

export type ShipmentPreviewFee = {
  mainService: number;
  insurance: number;
  stationDo: number;
  stationPu: number;
  return: number;
  r2s: number;
  coupon: number;
  codFailedFee: number;
};

export type GhnPreviewResponse = {
  orderCode: string;
  sortCode: string;
  transType: string;
  fee: ShipmentPreviewFee;
  totalFee: number;
  expectedDeliveryTime: string;
};

export type ShipmentPreview = {
  sellerId: string;
  sellerCompanyName: string;
  ghnPreviewResponse: GhnPreviewResponse;
};

export type Delivery = {
  paymentUrl: string;
  shipments: Shipment[];
};

export type Shipment = {
  id: string;
  orderCode: string;
  totalFee: number;
  mainServiceFee: number;
  provider: string;
  trackingNumber: string;
  shippedAt: string; 
  estimatedDelivery: string;
  status: ShipmentStatus; 
  inventoryItems: any[];
};
