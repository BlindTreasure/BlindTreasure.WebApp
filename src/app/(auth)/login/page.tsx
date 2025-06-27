import LoginForm from "@/app/(auth)/login/components/login-form";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";

export const metadata: Metadata = {
  title: "Đăng Nhập | BlindTreasure",
  description: "Đăng Nhập cho BlindTreasure",
};

export default function LogIn() {
  return (
    <div className="w-full">
      <LoginForm />
    </div>
  )
}