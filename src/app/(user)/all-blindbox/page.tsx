import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import AllBlindBoxes from "./components/all-blindbox";


export const metadata: Metadata = {
    title: "Tất cả sản túi mù",
    description: "Tất cả túi mù của BlindTreasure",
};

export default function AllBlindBoxesPage() {
    return (
        <div>
            <AllBlindBoxes />
        </div>
    )
}