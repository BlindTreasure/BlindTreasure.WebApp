import React from 'react'
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import Dashboard from './components/dashboard';


export const metadata: Metadata = {
    title: "Dashboard Seller",
    description: "Dashboard seller page for BlindTreasure",
};
export default function DashboardPageForSeller() {
    return (
        <div>
            <Dashboard />
        </div>
    )
}
