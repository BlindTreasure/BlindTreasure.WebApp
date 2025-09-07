"use client";

import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "@/utils/createStorage";
import rootReducer from "./rootReducer";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["userSlice", "authSlice"], // Giảm số lượng slice được persist
  throttle: 1000, // Thêm throttle để giảm số lần ghi vào storage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredActionPaths: ["register", "rehydrate"],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;