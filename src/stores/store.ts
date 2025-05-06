import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import storage from "redux-persist/lib/storage";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import userSlice from "@/stores/user-slice";
import authSlice from "@/stores/auth-slice";
import accountSlice from "@/stores/account-slice";
import differenceSlice from "@/stores/difference-slice";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["cartSlice", "userSlice"],
  blacklist: ["authSlice", "accountSlice", "differenceSlice"],
};

const rootReducer = combineReducers({
  userSlice: userSlice,
  authSlice: authSlice,
  accountSlice: accountSlice,
  differenceSlice: differenceSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export let persistor = persistStore(store);
