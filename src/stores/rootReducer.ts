import { combineReducers } from "@reduxjs/toolkit";
import userSlice from "@/stores/user-slice";
import authSlice from "@/stores/auth-slice";
import accountSlice from "@/stores/account-slice";
import differenceSlice from "@/stores/difference-slice";
import cartSlice from "@/stores/cart-slice";
import filterSlice from "@/stores/filter-product-slice";

const rootReducer = combineReducers({
  userSlice,
  authSlice,
  accountSlice,
  differenceSlice,
  cartSlice,
  filterSlice,
});

export default rootReducer;
