import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import OpenResultPage from "./components/open-result";

export const metadata: Metadata = {
    title: "OpenBox page",
    description: "OpenBox page for BlindTreasure",
};

export default function OpenBoxPage() {
    return (
        <div>
            <OpenResultPage />
        </div>
    )
}