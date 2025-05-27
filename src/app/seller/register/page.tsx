import React from 'react'
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import SellerForm from './components/sellerform';


export const metadata: Metadata = {
    title: "Seller registation form",
    description: "Seller registation form page for BlindTreasure",
};
export default function SellerFormPage() {
    return (
        <div>
            <SellerForm />
        </div>
    )
}
