import React from 'react'
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import SellerManagement from './components/seller-management';

export const metadata: Metadata = {
    title: "Dashboard Staff",
    description: "Dashboard staff page for BlindTreasure",
};
export default function SellerManagementPage() {
    return (
        <div>
            <SellerManagement />
        </div>
    )
}
