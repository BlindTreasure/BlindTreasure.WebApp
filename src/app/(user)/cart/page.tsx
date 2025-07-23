import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import Cart from "./components/cart";


export const metadata: Metadata = {
    title: "Giỏ hàng | BlindTreasure",
    description: "Giỏ hàng của BlindTreasure",
};

export default function CartPage() {
    return (
        <div>
            <Cart />
        </div>
    )
}