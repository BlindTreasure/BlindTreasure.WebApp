import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import CreateListing from "./components/createListing";


export const metadata: Metadata = {
    title: "Marketplace của BlindTreasure",
    description: "Marketplace của BlindTreasure",
};

export default function CreateListingPage() {
    return (
        <div>
            <CreateListing />
        </div>
    )
}