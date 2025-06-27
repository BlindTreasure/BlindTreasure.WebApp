'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import useRegisterSellerStep1 from "@/app/seller/information/hooks/useRegisterSellerStep1";
import useUploadSellerDocument from "@/app/seller/information/hooks/useUploadSellerDocument";

export default function RegisterSellerPage() {
  const [step, setStep] = useState("step1");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const router = useRouter();

  const {
    register,
    errors,
    submitStep1,
    isSubmitting,
  } = useRegisterSellerStep1({
    fullName: "",
    phoneNumber: "",
    dateOfBirth: "",
    companyName: "",
    taxId: "",
    companyAddress: "",
  });

  const handleRegistrationSuccess = () => {
    setShowSuccessAlert(true);
    
    // Sau 3 giây sẽ redirect đến trang pending
    setTimeout(() => {
      router.push("/seller/pending");
    }, 3000);
  };

  const {
    register: registerUpload,
    handleSubmit,
    onSubmit,
    errors: uploadErrors,
    isSubmitting: isUploading,
  } = useUploadSellerDocument(handleRegistrationSuccess);

  // Success Alert Component
  const SuccessAlert = () => (
    <Alert className="mb-6 border-green-200 bg-green-50">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertDescription className="text-green-800">
        <strong>Đăng ký thành công!</strong> Bạn sẽ được chuyển hướng đến trang quản lý trong giây lát...
      </AlertDescription>
    </Alert>
  );

  return (
    <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Đăng ký trở thành người bán</h1>

      {showSuccessAlert && <SuccessAlert />}

      <Tabs value={step} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="step1">Bước 1: Thông tin cá nhân</TabsTrigger>
          <TabsTrigger value="step2" disabled={step === "step1"}>Bước 2: Tài liệu định danh</TabsTrigger>
        </TabsList>

        <TabsContent value="step1">
          <form onSubmit={(e) => {
            e.preventDefault();
            submitStep1(() => setStep("step2"));
          }}>
            <Card>
              <CardContent className="py-8 px-6 sm:px-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="fullName">Họ và tên</Label>
                    <Input {...register("fullName")} />
                    {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber">Số điện thoại</Label>
                    <Input {...register("phoneNumber")} />
                    {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                    <Input type="date" {...register("dateOfBirth")} />
                    {errors.dateOfBirth && <p className="text-red-500 text-sm">{errors.dateOfBirth.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="companyName">Tên công ty</Label>
                    <Input {...register("companyName")} />
                    {errors.companyName && <p className="text-red-500 text-sm">{errors.companyName.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="taxId">Mã số thuế</Label>
                    <Input {...register("taxId")} />
                    {errors.taxId && <p className="text-red-500 text-sm">{errors.taxId.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="companyAddress">Địa chỉ công ty</Label>
                    <Input {...register("companyAddress")} />
                    {errors.companyAddress && <p className="text-red-500 text-sm">{errors.companyAddress.message}</p>}
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSubmitting ? "Đang xử lý..." : "Tiếp theo"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </TabsContent>

        <TabsContent value="step2">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
              <CardContent className="py-8 px-6 sm:px-8 space-y-6">
                <div>
                  <Label htmlFor="pdfUpload">Tải lên file định danh (PDF)</Label>
                  <Input
                    type="file"
                    accept="application/pdf"
                    {...registerUpload("file")}
                  />
                  {uploadErrors.file && (
                    <p className="text-red-500 text-sm">{uploadErrors.file.message}</p>
                  )}
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={isUploading}>
                    {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isUploading ? "Đang tải..." : "Hoàn tất đăng ký"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}