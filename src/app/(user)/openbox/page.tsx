import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import Openbox from "./components/openbox";


export const metadata: Metadata = {
    title: "OpenBox page",
    description: "OpenBox page for BlindTreasure",
};

export default function OpenBoxPage() {
    return (
        <div>
            <Openbox />
        </div>
    )
}