import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import AllProduct from "./components/products"

export const metadata: Metadata = {
    title: "All Product",
    description: "All product of Blind Treasure",
};

export default function Home() {
    return (
        <div>
            <AllProduct/>
        </div>
    )
}