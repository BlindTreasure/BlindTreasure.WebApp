import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import Purchased from "./components/purchased";

export const metadata: Metadata = {
    title: "Đơn mua",
    description: "Đơn mua của BlindTreasure",
};

export default function PurchasedPage() {
    return (
        <div>
            <Purchased />
        </div>
    )
}