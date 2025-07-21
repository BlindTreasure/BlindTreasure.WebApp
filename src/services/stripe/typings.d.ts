declare namespace REQUEST {
  type CreateOrderItem = {
    productId: string;
    productName: string;
    blindBoxId: string;
    blindBoxName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  };

  type CreateOrderList = {
    isShip?: boolean;
    promotionId?: string;
    items: CreateOrderItem[];
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
}
