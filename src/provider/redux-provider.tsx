"use client"

import { store } from "@/stores/store"
import { Provider } from "react-redux"
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

const persistor = persistStore(store);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <Provider store={store}>
            <PersistGate
                loading={
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                    </div>
                }
                persistor={persistor}
            >
                {children}
            </PersistGate>
        </Provider>
    )
}