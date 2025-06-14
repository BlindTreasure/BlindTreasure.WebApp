import React from 'react'
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import BlindboxDetail from '../components/detail';

export const metadata: Metadata = {
    title: "Category Form by Staff",
    description: "Category Form by staff page for BlindTreasure",
};
export default function CategoryFormPage() {
    return (
        <div>
            <BlindboxDetail />
        </div>
    )
}
