import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import PaymentFailedPage from "./components/fail";

export const metadata: Metadata = {
    title: "Payment Fail",
    description: "Payment fail for EduSource",
};

export default function FailPage() {
    return (
        <div>
            <PaymentFailedPage />
        </div>
    )
}