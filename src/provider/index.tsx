"use client";

import dynamic from "next/dynamic";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Message from "../components/message/message";
import useAutoRefreshToken from "@/hooks/use-auto-refresh-token";
const StoreProvider = dynamic(
    () => import("@/provider/redux-provider").then((mod) => mod.StoreProvider),
    {
        ssr: false,
    }
);

const ReactQueryProvider = dynamic(
    () => import("@/provider/query-provider").then((mod) => mod.default),
    { ssr: false }
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
        <StoreProvider>
            <ReactQueryProvider>
                <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
                    <AppInitializer />
                    <Message>{children}</Message>
                </GoogleOAuthProvider>
            </ReactQueryProvider>
        </StoreProvider>
    );
}
