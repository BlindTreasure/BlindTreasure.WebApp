import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import AllNewProducts from "./components/all-new-product";


export const metadata: Metadata = {
    title: "Tất cả sản phẩm mới",
    description: "Tất cả sản phẩm mới của BlindTreasure",
};

export default function AllNewProductsPage() {
    return (
        <div>
            <AllNewProducts />
        </div>
    )
}