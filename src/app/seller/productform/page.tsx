import React from 'react'
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import ProductForm from './components/productform';


export const metadata: Metadata = {
    title: "Products Form Seller",
    description: "Products Form seller page for BlindTreasure",
};
export default function ProductFormPageForSeller() {
    return (
        <div>
            <ProductForm />
        </div>
    )
}
