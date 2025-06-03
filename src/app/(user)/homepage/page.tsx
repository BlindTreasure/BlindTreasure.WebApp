import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";

import HomePage from "./components/home";


export const metadata: Metadata = {
    title: "Trang chủ",
    description: "Trang chủ của BlindTreasure",
};

export default function Home() {
    return (
        <div>
            <HomePage />
        </div>
    )
}