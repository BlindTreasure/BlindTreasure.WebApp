import React from 'react'
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import CreateProducts from './components/createproduct';


export const metadata: Metadata = {
    title: "Create Products Seller",
    description: "Create Products seller page for BlindTreasure",
};
export default function CreateProductsPageForSeller() {
    return (
        <div>
            <CreateProducts />
        </div>
    )
}
