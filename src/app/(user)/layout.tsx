'use client'
import Footer from "@/components/footer";
import Header from "@/components/header";
import { Roles } from "@/const/authentication";
import { openMessageUser } from "@/stores/difference-slice";
import { useAppDispatch, useAppSelector } from "@/stores/store";
import { usePathname, useRouter } from "next/navigation";

export default function UserLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();
    const hideHeaderFooter = pathname === "/thankyou" || pathname === "/change-password-success" || pathname === "/fail";
    const dispatch = useAppDispatch();
    const userState = useAppSelector((state) => state.userSlice);
    const handleOpenChat = () => {
        dispatch(openMessageUser());
    };

    return (
        <div className="min-h-screen flex flex-col">
            {!hideHeaderFooter && <Header />}
            <main className="flex-grow">
                {children}
            </main>
            {!hideHeaderFooter && <Footer />}
            {(!userState.user || userState.user?.roleId === Roles[1]?.id) && (
                <button
                    onClick={handleOpenChat}
                    className="fixed bottom-6 right-6 w-14 h-14 bg-[#fb8500] text-white rounded-full flex items-center justify-center shadow-lg hover:opacity-80 transition"
                >
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/2040/2040946.png"
                        alt="Chatbot"
                        className="w-10 h-10 object-cover"
                    />
                </button>
            )}
        </div>
    );
}
