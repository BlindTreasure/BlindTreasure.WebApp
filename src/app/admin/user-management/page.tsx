import React from 'react'
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import UserManagement from './components/usermanagement';


export const metadata: Metadata = {
    title: "User Mangegement by Admin",
    description: "User Mangegement by admin page for BlindTreasure",
};
export default function UserManagementPage() {
    return (
        <div>
            <UserManagement />
        </div>
    )
}
