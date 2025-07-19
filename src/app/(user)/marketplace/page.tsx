import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import MarketPlace from "./components/marketplace";


export const metadata: Metadata = {
    title: "Marketplace của BlindTreasure",
    description: "Marketplace của BlindTreasure",
};

export default function AllBlindBoxesPage() {
    return (
        <div>
            <MarketPlace />
        </div>
    )
}