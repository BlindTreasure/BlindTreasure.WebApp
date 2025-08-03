import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import ConfirmTrading from "./components/confirm-trading";


export const metadata: Metadata = {
    title: "Xác nhận trao đổi của BlindTreasure",
    description: "Xác nhận trao đổi của BlindTreasure",
};

export default function ConfirmTradingPage() {
    return (
        <div>
            <ConfirmTrading />
        </div>
    )
}