import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import Inventory from "./components/inventory";


export const metadata: Metadata = {
    title: "Túi đồ",
    description: "Trang túi đồ của khách hàng BlindTreasure",
};

export default function InventoryPage() {
    return (
        <div>
            <Inventory />
        </div>
    )
}