
declare namespace REQUEST {
  type CreateOrderItem = {
    productId: string;
    productName: string;
    blindBoxId: string;
    blindBoxName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }

  type CreateOrderList = {
    shippingAddressId: string;
    items: CreateOrderItem[];
  }
}


