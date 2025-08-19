import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import AllSaleProductsComponent from "./components/all-sale-products";

export const metadata: Metadata = {
    title: "Tất cả sản phẩm giảm giá | BlindTreasure",
    description: "Tất cả sản phẩm giảm giá của BlindTreasure",
};

export default function Home() {
    return (
        <div>
            <AllSaleProductsComponent/>
        </div>
    )
}