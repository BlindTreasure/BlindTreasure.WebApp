import RegisterForm from "@/app/(auth)/signup/components/register-form";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Sign Up for PawFund",
};

export default function SignUp() {
  return (
    <div className="w-full">
      <RegisterForm />
    </div>
  )
}
