import React from 'react'
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import Orders from './components/orders';

export const metadata: Metadata = {
    title: "Lịch sử đơn hàng | BlindTreasure",
    description: "Lịch sử đơn hàng BlindTreasure",
};
export default function OrderSellerPage() {
    return (
        <div>
            <Orders />
        </div>
    )
}
