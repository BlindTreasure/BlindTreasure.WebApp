import React from 'react'
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import BlindboxManagement from './components/blindboxmanagement';

export const metadata: Metadata = {
    title: "Blindbox Management by Staff",
    description: "Blindbox Management by staff page for BlindTreasure",
};
export default function BlindboxManagementPage() {
    return (
        <div>
            <BlindboxManagement />
        </div>
    )
}


