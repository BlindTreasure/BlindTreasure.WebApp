import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";

import HomePage from "./components/home";


export const metadata: Metadata = {
    title: "Home page",
    description: "Hom page for Capstone",
};

export default function Home() {
    return (
        <div>
            <HomePage />
        </div>
    )
}