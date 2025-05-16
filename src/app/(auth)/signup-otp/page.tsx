import RegisterForm from "@/app/(auth)/signup/components/register-form";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import SignupOtp from "./components/signup-otp";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Sign Up for BlindTreasure",
};

export default function SignUp() {
  return (
    <div className="w-full">
      <SignupOtp />
    </div>
  )
}
