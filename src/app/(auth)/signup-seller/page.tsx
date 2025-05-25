import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import SignupSeller from "./components/signup-seller";

export const metadata: Metadata = {
  title: "Đăng ký bán hàng",
  description: "Đăng ký bán hàng cho BlindTreasure",
};

export default function SignUp() {
  return (
    <div className="w-full">
      <SignupSeller />
    </div>
  )
}
