import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/stores/store";

export interface CartState {
  items: API.CartItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string | null;
}

const initialState: CartState = {
  items: [],
  status: "idle",
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<API.CartItem[]>) => {
      state.items = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { setCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;

export const selectTotalItems = (state: RootState) =>
  state.cartSlice.items.length;
