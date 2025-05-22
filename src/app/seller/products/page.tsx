import React from 'react'
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import Products from './components/products';


export const metadata: Metadata = {
    title: "Products Seller",
    description: "Products seller page for BlindTreasure",
};
export default function ProductsPageForSeller() {
    return (
        <div>
            <Products />
        </div>
    )
}
