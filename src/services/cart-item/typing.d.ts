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

// declare namespace API {
//   type CartItem = {
//     id: string;
//     productId?: string;
//     productName?: string;
//     productImages?: string;
//     blindBoxId?: string;
//     blindBoxName?: string;
//     blindBoxImage?: string;
//     quantity: number;
//     unitPrice: number;
//     totalPrice: number;
//     createdAt: string;
//     isValid?: boolean;
//   };

//   type ResponseDataCart = {
//     items: CartItem[];
//     totalQuantity: number;
//     totalPrice: number;
//   };
// }

declare namespace API {
  type CartItem = {
    id: string;
    productId?: string;
    productName?: string;
    productImages?: string[]; 
    blindBoxId?: string;
    blindBoxName?: string;
    blindBoxImage?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    createdAt: string;
    isValid?: boolean;
    availableStock?: number;
  };

  type SellerCartGroup = {
    sellerId: string;
    sellerName: string;
    items: CartItem[];
    sellerTotalQuantity: number;
    sellerTotalPrice: number;
  };

  type ResponseDataCart = {
    sellerItems: SellerCartGroup[];
    totalQuantity: number;
    totalPrice: number;
  };
}
