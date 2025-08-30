import React from 'react'
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import ForceReleaseHold from './components/force-release-hold';

export const metadata: Metadata = {
    title: "Duyệt trạng thái | BlindTreasure",
    description: "Bỏ qua cronjobs khi item đang ở trạng thái Tạm giữ",
};
export default function ForceReleaseHoldPage() {
    return (
        <div>
            <ForceReleaseHold />
        </div>
    )
}
