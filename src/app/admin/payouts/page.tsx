import React from 'react'
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import Payouts from './components/payouts';

export const metadata: Metadata = {
    title: "Duyệt rút tiền | BlindTreasure",
    description: "Duyệt rút tiền BlindTreasure",
};
export default function OrderSellerPage() {
    return (
        <div>
            <Payouts />
        </div>
    )
}
