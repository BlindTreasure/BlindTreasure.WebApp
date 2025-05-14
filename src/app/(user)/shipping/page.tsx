import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import OrderDetailPage from "./components/shipping";


export const metadata: Metadata = {
    title: "Shipping page",
    description: "Shipping page for BlindTreasure",
};

export default function ShippingPage() {
    return (
        <div>
            <OrderDetailPage />
        </div>
    )
}