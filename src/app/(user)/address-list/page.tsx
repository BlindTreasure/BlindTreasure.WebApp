import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import AddressList from "./components/address-list";

export const metadata: Metadata = {
    title: "Thiết lập địa chỉ",
    description: "Thiết lập địa chỉ Blind Treasure",
};

export default function AddAddress() {
    return (
        <div>
            <AddressList/>
        </div>
    )
}