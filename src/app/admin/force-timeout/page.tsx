import React from 'react'
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import ForceTimeout from './components/force-timeout';

export const metadata: Metadata = {
    title: "Bỏ qua cronjobs | BlindTreasure",
    description: "Bỏ qua cronjobs",
};
export default function ForceTimeoutPage() {
    return (
        <div>
            <ForceTimeout />
        </div>
    )
}
