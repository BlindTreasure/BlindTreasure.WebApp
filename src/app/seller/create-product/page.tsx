import React from 'react'
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import CreateProductSeller from './components/create-product';


export const metadata: Metadata = {
    title: "Tạo sản phẩm",
    description: "Tạo sản phẩm BlindTreasure",
};
export default function DashboardPageForSeller() {
    return (
        <div>
            <CreateProductSeller />
        </div>
    )
}
