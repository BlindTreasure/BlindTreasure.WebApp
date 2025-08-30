import React from 'react'
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import ForceTimeout from './components/force-timeout';

export const metadata: Metadata = {
    title: "Xử lí thời gian đếm ngược | BlindTreasure",
    description: "Admin toàn quyền xử lí thời gian đếm ngược cho các yêu cầu trao đổi",
};
export default function ForceTimeoutPage() {
    return (
        <div>
            <ForceTimeout />
        </div>
    )
}
