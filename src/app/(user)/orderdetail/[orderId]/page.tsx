import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import OrderDetail from "../components/orderdetail";


export const metadata: Metadata = {
    title: "Chi tiết hóa đơn | BlindTreasure",
    description: "Chi tiết hóa đơn BlindTreasure",
};

export default function OrderDetailPage() {
    return (
        <div>
            <OrderDetail />
        </div>
    )
}