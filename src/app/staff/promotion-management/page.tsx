import React from 'react'
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import PromotionManagement from './components/promotionmanagement';

export const metadata: Metadata = {
    title: "Promotion Management by Staff",
    description: "Promotion Management by staff page for BlindTreasure",
};
export default function CategoryManagementPage() {
    return (
        <div>
            <PromotionManagement />
        </div>
    )
}
