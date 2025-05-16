import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import OrderHistory from "./components/orderhistory";


export const metadata: Metadata = {
    title: "OrderHistory page",
    description: "OrderHistory page for BlindTreasure",
};

export default function OrderHistoryPage() {
    return (
        <div>
            <OrderHistory />
        </div>
    )
}