import React from 'react'
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import CreateBlindBoxForm from './components/blindbox';


export const metadata: Metadata = {
    title: "Tạo túi mù | BlindTreasure",
    description: "Tạo túi mù BlindTreasure",
};
export default function BlindboxPageForSeller() {
    return (
        <div>
            <CreateBlindBoxForm />
        </div>
    )
}
