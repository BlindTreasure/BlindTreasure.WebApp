import React from 'react'
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import Transactions from './components/transactions';

export const metadata: Metadata = {
    title: "Lịch sử giao dịch | BlindTreasure",
    description: "Lịch sử giao dịch BlindTreasure",
};
export default function TransactionsPage() {
    return (
        <div>
            <Transactions />
        </div>
    )
}
