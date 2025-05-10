
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import Contact from "./components/contact";

export const metadata: Metadata = {
    title: "Contact",
    description: "Contact for BlindTreasure",
};

export default function Home() {
    return (
        <div>
            <Contact />
        </div>
    )
}