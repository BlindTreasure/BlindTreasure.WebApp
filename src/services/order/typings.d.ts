import { OrderStatus, PaymentStatus } from "@/const/products";

export type OrderResponse = {
  id: string;
  status: PaymentStatus;
  totalAmount: number;
  placedAt: string;
  shippingAddress: {
    id: string;
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  details: OrderDetail[];
  payment: PaymentInfo;
};

export type OrderDetail = {
  id: string;
  productId: string;
  productName: string;
  productImages: string[];
  blindBoxId?: string;
  blindBoxName?: string;
  blindBoxImage?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: OrderStatus;
};

export type PaymentInfo = {
  id: string;
  orderId: string;
  amount: number;
  discountRate: number;
  netAmount: number;
  method: string;
  status: PaymentStatus;
  transactionId: string;
  paidAt: string;
  refundedAmount: number;
  transactions: PaymentTransaction[];
};

export type PaymentTransaction = {
  id: string;
  type: "Checkout";
  amount: number;
  currency: string;
  status: "Pending" | "Success" | "Failed";
  occurredAt: string;
  externalRef: string;
};
