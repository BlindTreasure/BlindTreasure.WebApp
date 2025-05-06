import LoginForm from "@/app/(auth)/login/components/login-form";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log In for BlindTreasure",
};

export default function LogIn() {
  return (
    <div className="w-full">
      <LoginForm />
    </div>
  )
}