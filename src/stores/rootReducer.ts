import { combineReducers } from "@reduxjs/toolkit";
import userSlice from "@/stores/user-slice";
import authSlice from "@/stores/auth-slice";
import accountSlice from "@/stores/account-slice";
import differenceSlice from "@/stores/difference-slice";
import cartSlice from "@/stores/cart-slice";
import filterSlice from "@/stores/filter-product-slice";
import notificationSlice from "@/stores/notification-slice"
import chatSlide from "@/stores/chat-slice"

const rootReducer = combineReducers({
  userSlice,
  authSlice,
  accountSlice,
  differenceSlice,
  cartSlice,
  filterSlice,
  notificationSlice,
  chatSlide
});

export default rootReducer;
