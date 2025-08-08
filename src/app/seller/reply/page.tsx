import React from 'react'
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import Reply from './components/reply';


export const metadata: Metadata = {
    title: "Phản hồi khách hàng | BlindTreasure",
    description: "Phản hồi khách hàng BlindTreasure",
};
export default function UnboxLogsPage() {
    return (
        <div>
            <Reply />
        </div>
    )
}
