'use client'

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SellerInfoForm } from "@/components/seller-info-form";
import { VerifyEmailStep } from "@/components/verify-email-step";

export default function RegisterSellerPage() {
  const [step, setStep] = useState("verify-email");
  const [email, setEmail] = useState("");

  const handleEmailVerified = (verifiedEmail: string) => {
    setEmail(verifiedEmail);
    setStep("seller-info");
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-6">Đăng ký trở thành người bán</h1>
      <Tabs value={step} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="verify-email">Xác thực Email</TabsTrigger>
          <TabsTrigger value="seller-info" disabled={step === "verify-email"}>
            Thông tin Shop
          </TabsTrigger>
        </TabsList>
        <TabsContent value="verify-email">
          <VerifyEmailStep onVerified={handleEmailVerified} />
        </TabsContent>
        <TabsContent value="seller-info">
          <SellerInfoForm email={email} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
