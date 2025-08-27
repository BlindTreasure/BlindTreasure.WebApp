import React from 'react'
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import ForceReleaseHold from './components/force-release-hold';

export const metadata: Metadata = {
    title: "Bỏ qua cronjobs | BlindTreasure",
    description: "Bỏ qua cronjobs",
};
export default function ForceReleaseHoldPage() {
    return (
        <div>
            <ForceReleaseHold />
        </div>
    )
}
