import React from 'react'
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import UnboxLogs from './components/unbox-logs';


export const metadata: Metadata = {
    title: "Lịch sử thưởng | BlindTreasure",
    description: "Lịch sử thưởng blindbox BlindTreasure",
};
export default function UnboxLogsPage() {
    return (
        <div>
            <UnboxLogs />
        </div>
    )
}
