import {
  OrderStatus,
  PaymentInfoStatus,
  PaymentStatus,
  StockStatus,
  BlindboxStatus,
} from "@/const/products";

export type InventoryItem = {
  id: string;
  userId: string;
  productId: string;
  product: Product;
  quantity: number;
  location: string;
  status: Status;
  createdAt: string;
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
