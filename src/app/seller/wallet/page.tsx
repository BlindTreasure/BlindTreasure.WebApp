import React from 'react'
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import Wallet from './components/wallet';


export const metadata: Metadata = {
    title: "Ví rút tiền | BlindTreasure",
    description: "Ví rút tiền BlindTreasure",
};
export default function WalletPage() {
    return (
        <div>
            <Wallet />
        </div>
    )
}
