import React from 'react'
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import Dashboard from './components/dashboard';


export const metadata: Metadata = {
    title: "Dashboard Admin",
    description: "Dashboard admin page for BlindTreasure",
};
export default function DashboardPage() {
    return (
        <div>
            <Dashboard />
        </div>
    )
}
