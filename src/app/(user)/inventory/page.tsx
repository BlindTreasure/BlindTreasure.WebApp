import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import Inventory from "./components/inventory";


export const metadata: Metadata = {
    title: "Inventory page",
    description: "Inventory page for BlindTreasure",
};

export default function InventoryPage() {
    return (
        <div>
            <Inventory />
        </div>
    )
}