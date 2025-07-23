import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import { Suspense } from "react";
import MagicBoxOpening from "./components/open-result";

export const metadata: Metadata = {
    title: "Mở hộp thưởng | BlindTreasure",
    description: "Mở hộp thưởng của BlindTreasure",
};

export default function OpenBoxPage() {
    return (
        <div>
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
                <MagicBoxOpening />
            </Suspense>
        </div>
    )
}