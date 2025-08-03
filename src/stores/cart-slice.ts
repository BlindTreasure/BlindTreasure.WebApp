import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/stores/store";

export interface SellerCartGroup {
  sellerId: string;
  sellerName: string;
  items: API.CartItem[];
  sellerTotalQuantity: number;
  sellerTotalPrice: number;
}

export interface CartState {
  sellerItems: SellerCartGroup[];
  totalQuantity: number;
  totalPrice: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string | null;
}

const initialState: CartState = {
  sellerItems: [],
  totalQuantity: 0,
  totalPrice: 0,
  status: "idle",
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<API.ResponseDataCart>) => {
      state.sellerItems = action.payload.sellerItems;
      state.totalQuantity = action.payload.totalQuantity;
      state.totalPrice = action.payload.totalPrice;
    },
    clearCart: (state) => {
      state.sellerItems = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
  },
});

export const { setCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;

// Selectors
export const selectTotalItems = (state: RootState) =>
  state.cartSlice.sellerItems?.reduce(
    (sum, seller) => sum + seller.items.length,
    0
  ) || 0;

export const selectAllItems = (state: RootState) =>
  state.cartSlice.sellerItems?.flatMap((seller) => seller.items) || [];

export const selectTotalPrice = (state: RootState) =>
  state.cartSlice.totalPrice || 0;
