import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import Favorite from "./components/favorite"

export const metadata: Metadata = {
    title: "Product Favorite",
    description: "Product Favorite of Blind Treasure",
};

export default function Home() {
    return (
        <div>
            <Favorite/>
        </div>
    )
}