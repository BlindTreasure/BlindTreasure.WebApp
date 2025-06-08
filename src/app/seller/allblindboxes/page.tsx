import React from 'react'
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import BlindboxTable from './components/all-blindboxes';


export const metadata: Metadata = {
    title: "Tất cả túi mù",
    description: "Tất cả túi mù BlindTreasure",
};
export default function DashboardPageForSeller() {
    return (
        <div>
            <BlindboxTable />
        </div>
    )
}
