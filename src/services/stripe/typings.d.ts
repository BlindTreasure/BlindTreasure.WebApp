// declare namespace REQUEST {
//   type CreateOrderItem = {
//     productId: string;
//     productName: string;
//     blindBoxId: string;
//     blindBoxName: string;
//     quantity: number;
//     unitPrice: number;
//     totalPrice: number;
//   };

//   type CreateOrderList = {
//     isShip?: boolean;
//     promotionId?: string;
//     items: CreateOrderItem[];
//   };
// }

declare namespace REQUEST {
  type CreateOrderItem = {
    id: string;
    productId: string;
    productName: string;
    productImages?: string[];
    blindBoxId: string;
    blindBoxName: string;
    blindBoxImage?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    createdAt?: string;
  };

  type CreateOrderSellerGroup = {
    sellerId: string;
    sellerName: string;
    items: CreateOrderItem[];
    promotionId?: string;
  };

  type CreateOrderList = {
    isShip?: boolean;
    sellerItems: CreateOrderSellerGroup[];
  };
}

declare namespace API {
  type ShipmentPreviewFee = {
    mainService: number;
    insurance: number;
    stationDo: number;
    stationPu: number;
    return: number;
    r2s: number;
    coupon: number;
    codFailedFee: number;
  };

  type GhnPreviewResponse = {
    orderCode: string;
    sortCode: string;
    transType: string;
    fee: ShipmentPreviewFee;
    totalFee: number;
    expectedDeliveryTime: string;
  };

  type ShipmentPreview = {
    sellerId: string;
    sellerCompanyName: string;
    ghnPreviewResponse: GhnPreviewResponse;
  };

  type OrderInfo = {
    orderId: string;
    sellerId: string;
    sellerName: string;
    paymentUrl: string;
    finalAmount: number;
  };

  type CreateOrderData = {
    orders: OrderInfo[];
    message: string;
    generalPaymentUrl: string;
    checkoutGroupId: string;
  };
}
