import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import Purchased from "./components/purchased";
import RequireAuth from "@/components/require-auth";

export const metadata: Metadata = {
    title: "Đơn mua",
    description: "Đơn mua của BlindTreasure",
};

export default function PurchasedPage() {
    return (
        <div>
            <RequireAuth>
                <Purchased />
            </RequireAuth>
        </div>
    )
}