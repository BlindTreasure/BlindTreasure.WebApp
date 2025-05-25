import React from 'react'
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import StaffDashboard from './components/dashboard';

export const metadata: Metadata = {
    title: "Dashboard Staff",
    description: "Dashboard staff page for BlindTreasure",
};
export default function DashboardPage() {
    return (
        <div>
            <StaffDashboard />
        </div>
    )
}
