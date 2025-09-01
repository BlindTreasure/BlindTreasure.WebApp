import React from 'react'
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import Shipments from './components/shipments';

export const metadata: Metadata = {
    title: "Lịch sử đơn hàng | BlindTreasure",
    description: "Lịch sử đơn hàng BlindTreasure",
};
export default function ShipmentsAminPage() {
    return (
        <div>
            <Shipments />
        </div>
    )
}
