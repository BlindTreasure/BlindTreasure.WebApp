import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import ShopProducts from "../components/shop-products";

export const metadata: Metadata = {
    title: "Cửa hàng | BlindTreasure",
    description: "Xem tất cả sản phẩm của cửa hàng",
};

export default function ShopPage({ params }: { params: { sellerId: string } }) {
    return (
        <div className="w-full">
            <ShopProducts sellerId={params.sellerId} />
        </div>
    );
}
