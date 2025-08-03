 import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import Wishlist from "./components/wishlist";


export const metadata: Metadata = {
    title: "Danh sách yêu thích",
    description: "Danh sách yêu thích của BlindTreasure",
};

export default function WishlistPage() {
    return (
        <div>
            <Wishlist />
        </div>
    )
}