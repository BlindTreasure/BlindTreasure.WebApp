declare namespace REQUEST {
  type UpdateQuantityItemCart = {
    cartItemId: string;
    quantity: number;
  }

  type AddItemToCart = {
    productId?: string;
    blindBoxId?: string;
    quantity:number
  }
}

declare namespace API {
  type CartItem = {
    id: string;
    productId?: string;
    productName?: string;
    productImages?: string;
    blindBoxId?: string;
    blindBoxName?: string;
    blindBoxImage?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    createdAt: string;
  };

  type ResponseDataCart = {
    items: CartItem[];
    totalQuantity: number;
    totalPrice: number;
  };
}
