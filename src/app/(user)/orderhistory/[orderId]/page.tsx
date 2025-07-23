import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import OrderHistory from "../components/orderhistory";


export const metadata: Metadata = {
    title: "Chi tiết hóa đơn | BlindTreasure",
    description: "Chi tiết hóa đơn BlindTreasure",
};

export default function OrderHistoryPage() {
    return (
        <div>
            <OrderHistory />
        </div>
    )
}