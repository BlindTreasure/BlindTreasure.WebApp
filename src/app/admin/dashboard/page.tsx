import React from 'react'
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import Dashboard from './components/dashboard';

export const metadata: Metadata = {
    title: "Trang tổng quan Admin | BlindTreasure",
    description: "Trang tổng quan Admin của BlindTreasure",
};

export default function DashboardPageForAdmin() {
    return (
        <div className="h-full">
            <Dashboard />
        </div>
    )
}