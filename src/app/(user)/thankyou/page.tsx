import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import Thankyou from "./components/thankyou";

export const metadata: Metadata = {
    title: "Thank you",
    description: "Thank you for EduSource",
};

export default function Home() {
    return (
        <div>
            <Thankyou />
        </div>
    )
}