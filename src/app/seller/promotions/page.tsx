import React from 'react'
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import PromotionManagement from './components/promotions';

export const metadata: Metadata = {
    title: "Promotion Management by Seller",
    description: "Promotion Management by seller page for BlindTreasure",
};
export default function CategoryManagementPage() {
    return (
        <div>
            <PromotionManagement />
        </div>
    )
}
