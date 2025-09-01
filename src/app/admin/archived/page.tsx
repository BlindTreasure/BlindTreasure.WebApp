import React from 'react'
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import Archived from './components/archived';

export const metadata: Metadata = {
    title: "Mô phỏng hàng quá hạn | BlindTreasure",
    description: "Mô phỏng hàng quá hạn BlindTreasure",
};
export default function ShipmentsAminPage() {
    return (
        <div>
            <Archived />
        </div>
    )
}
