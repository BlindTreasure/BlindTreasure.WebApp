import React from 'react'
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import Dashboard from './components/dashboard';


export const metadata: Metadata = {
    title: "Trang tổng quan người bán | BlindTreasure",
    description: "Trang tổng quan người bán của BlindTreasure",
};
export default function DashboardPageForSeller() {
    return (
        <div>
            <Dashboard />
        </div>
    )
}
