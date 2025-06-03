import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import AllProduct from "./components/products"

export const metadata: Metadata = {
    title: "Tất cả sản phẩm",
    description: "Tất cả sản phẩm của Blind Treasure",
};

export default function Home() {
    return (
        <div>
            <AllProduct/>
        </div>
    )
}