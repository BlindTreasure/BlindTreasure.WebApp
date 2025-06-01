import React from 'react'
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import CategoryManagement from './components/categorymanagement';

export const metadata: Metadata = {
    title: "Category Management by Staff",
    description: "Category Management by staff page for BlindTreasure",
};
export default function CategoryManagementPage() {
    return (
        <div>
            <CategoryManagement />
        </div>
    )
}
