import React from 'react'
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import ProductTable from './components/all-product';


export const metadata: Metadata = {
    title: "Tất cả sản phẩm",
    description: "Tất cả sản phẩm BlindTreasure",
};
export default function DashboardPageForSeller() {
    return (
        <div>
            <ProductTable />
        </div>
    )
}
