import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import CheckoutForm from './components/CheckoutForm';

export const metadata: Metadata = {
  title: "Thanh toán | BlindTreasure",
  description: "Thanh toán đơn hàng BlindTreasure",
};

export default function CheckoutPage() {
  return (
    <div>
      <CheckoutForm />
    </div>
  );
}
