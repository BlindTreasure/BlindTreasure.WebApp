"use client";

import dynamic from "next/dynamic";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Message from "../components/message/message";
import useAutoRefreshToken from "@/hooks/use-auto-refresh-token";
import SignalRProvider from "./signalr-provider";
import { ThemeProvider } from "@/context/ThemeContext";
import { Suspense } from "react";

// Loading components
const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
    </div>
);

const StoreProvider = dynamic(
    () => import("@/provider/redux-provider").then((mod) => mod.StoreProvider),
    {
        ssr: false,
        loading: () => <LoadingSpinner />
    }
);

const ReactQueryProvider = dynamic(
    () => import("@/provider/query-provider").then((mod) => mod.default),
    { 
        ssr: false,
        loading: () => <LoadingSpinner /> 
    }
);

const AppInitializer = () => {
    useAutoRefreshToken();
    return null;
};

export default function Provider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <StoreProvider>
                <ReactQueryProvider>
                    <ThemeProvider>
                        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
                            <SignalRProvider>
                                <AppInitializer />
                                <Message>{children}</Message>
                            </SignalRProvider>
                        </GoogleOAuthProvider>
                    </ThemeProvider>
                </ReactQueryProvider>
            </StoreProvider>
        </Suspense>
    );
}
