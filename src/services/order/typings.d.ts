// import { OrderStatus, PaymentInfoStatus, PaymentStatus } from "@/const/products";

// export type OrderResponse = {
//   id: string;
//   status: PaymentStatus;
//   totalAmount: number;
//   placedAt: string;
//   completedAt: string;
//   shippingAddress: {
//     id: string;
//     fullName: string;
//     phone: string;
//     addressLine: string;
//     city: string;
//     province: string;
//     postalCode: string;
//     country: string;
//   };
//   details: OrderDetail[];
//   payment: PaymentInfo;
// };

// export type OrderDetail = {
//   id: string;
//   productId: string;
//   productName: string;
//   productImages: string[];
//   blindBoxId?: string;
//   blindBoxName?: string;
//   blindBoxImage?: string;
//   quantity: number;
//   unitPrice: number;
//   totalPrice: number;
//   status: OrderStatus;
// };

// export type PaymentInfo = {
//   id: string;
//   orderId: string;
//   amount: number;
//   discountRate: number;
//   netAmount: number;
//   method: string;
//   status: PaymentInfoStatus;
//   transactionId: string;
//   paidAt: string;
//   refundedAmount: number;
//   transactions: PaymentTransaction[];
// };

// export type PaymentTransaction = {
//   id: string;
//   type: "Checkout";
//   amount: number;
//   currency: string;
//   status: "Pending" | "Success" | "Failed";
//   occurredAt: string;
//   externalRef: string;
// };

import { OrderStatus, PaymentInfoStatus, PaymentStatus } from "@/const/products";

export type OrderResponse = {
  id: string;
  status: PaymentStatus;
  totalAmount: number;
  placedAt: string; 
  completedAt: string | null; 
  shippingAddress?: ShippingAddress;
  details: OrderDetail[];
  payment: PaymentInfo;
};

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
  productId: string;
  productName: string;
  productImages: string[];
  blindBoxId?: string | null;
  blindBoxName?: string | null;
  blindBoxImage?: string | null;
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
  status: PaymentInfoStatus;
  transactionId: string;
  paidAt: string | null;
  refundedAmount: number;
  transactions: PaymentTransaction[];
};

export type PaymentTransaction = {
  id: string;
  type: "Checkout" | string; 
  amount: number;
  currency: string;
  status: "Pending" | "Success" | "Failed";
  occurredAt: string;
  externalRef: string;
};
