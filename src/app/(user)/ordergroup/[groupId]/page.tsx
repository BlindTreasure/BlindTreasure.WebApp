import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import OrderGroupDetail from "../components/order-group-detail";
import RequireAuth from "@/components/require-auth";

export const metadata: Metadata = {
    title: "Chi tiết nhóm đơn hàng | BlindTreasure",
    description: "Chi tiết nhóm đơn hàng BlindTreasure",
};

export default function OrderGroupPage() {
    return (
        <div>
            <RequireAuth>
                <OrderGroupDetail />
            </RequireAuth>
        </div>
    );
}
