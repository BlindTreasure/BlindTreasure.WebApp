'use client'
import Footer from "@/components/footer";
import Header from "@/components/header";
import { openMessageUser } from "@/stores/difference-slice";
import { useAppDispatch, useAppSelector } from "@/stores/store";
import { usePathname } from "next/navigation";
import { WishlistProvider } from "@/contexts/WishlistContext";
import CustomerSellerChat from "@/components/chat-widget";
import useInitialAuth from "@/hooks/use-initial-auth";

export default function UserLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();
    const hideHeaderFooter = pathname === "/thankyou" || pathname === "/change-password-success" || pathname === "/fail" || pathname === "/open-result";
    const hideChatButtons = pathname === "/open-result";
    const dispatch = useAppDispatch();
    const userState = useAppSelector((state) => state.userSlice);
    const { loading } = useInitialAuth({ redirectIfUnauthenticated: false });

    const handleOpenChat = () => {
        dispatch(openMessageUser());
    };

    // Show loading while initializing auth
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <WishlistProvider>
                {!hideHeaderFooter && <Header />}
                <main className="flex-grow">
                    {children}
                </main>
                {!hideHeaderFooter && <Footer />}
            </WishlistProvider>

            {(!userState.user || userState.user?.roleName === "Customer") && !hideChatButtons && (
                <button
                    onClick={handleOpenChat}
                    className="fixed bottom-24 right-6 w-14 h-14 bg-white text-white rounded-full flex items-center justify-center shadow-lg hover:opacity-80 transition z-40"
                >
                    <img
                        src="https://img.freepik.com/free-vector/chatbot-chat-message-vectorart_78370-4104.jpg?semt=ais_hybrid&w=740&q=80"
                        alt="Chatbot"
                        className="w-10 h-10 object-cover"
                    />
                </button>
            )}

            {userState.user && userState.user?.roleName === "Customer" && !hideChatButtons && (
                <CustomerSellerChat />
            )}
        </div>
    );
}
