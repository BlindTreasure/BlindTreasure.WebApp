import React from 'react'
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import PendingPage from './components/pendingpage';


export const metadata: Metadata = {
    title: "Seller pending page",
    description: "Seller pending page for BlindTreasure",
};
export default function SellerPendingPage() {
    return (
        <div>
            <PendingPage />
        </div>
    )
}
