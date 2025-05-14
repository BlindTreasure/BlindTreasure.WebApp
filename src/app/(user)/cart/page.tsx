import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import Cart from "./components/cart";


export const metadata: Metadata = {
    title: "Cart page",
    description: "Cart page for BlindTreasure",
};

export default function CartPage() {
    return (
        <div>
            <Cart />
        </div>
    )
}