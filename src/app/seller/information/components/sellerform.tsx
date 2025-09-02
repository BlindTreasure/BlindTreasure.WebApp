'use client';

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { CheckCircle, Loader2, HelpCircle, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import useRegisterSellerStep1 from "@/app/seller/information/hooks/useRegisterSellerStep1";
import useUploadSellerDocument from "@/app/seller/information/hooks/useUploadSellerDocument";
import { useServiceGetSellerProfile } from "@/services/account/services";

export default function RegisterSellerPage() {
  const [step, setStep] = useState("step1");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showStep1RequiredAlert, setShowStep1RequiredAlert] = useState(false);
  const [step1Completed, setStep1Completed] = useState(false);
  const router = useRouter();

  // Lấy thông tin seller để kiểm tra status
  const { data: sellerProfile, isLoading: isLoadingProfile } = useServiceGetSellerProfile();

  // Kiểm tra seller status và redirect nếu cần
  useEffect(() => {
    if (sellerProfile && sellerProfile.value.data) {
      const sellerStatus = sellerProfile.value.data.sellerStatus;
      if (sellerStatus === "Approved") {
        router.push("/seller/dashboard");
      }
    }
  }, [sellerProfile, router]);

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
    onSubmit: originalOnSubmit,
    errors: uploadErrors,
    isSubmitting: isUploading,
  } = useUploadSellerDocument(handleRegistrationSuccess);

  // Handle submit step 2 with validation
  const handleStep2Submit = (data: any) => {
    if (!step1Completed) {
      setShowStep1RequiredAlert(true);
      setStep("step1");
      return;
    }
    originalOnSubmit(data);
  };

  // Success Alert Component
  const SuccessAlert = () => (
    <Alert className="mb-6 border-green-200 bg-green-50">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertDescription className="text-green-800">
        <strong>Đăng ký thành công!</strong> Bạn sẽ được chuyển hướng đến trang quản lý trong giây lát...
      </AlertDescription>
    </Alert>
  );

  // Step 1 Required Alert Component
  const Step1RequiredAlert = () => (
    <Alert className="mb-6 border-orange-200 bg-orange-50">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertDescription className="text-orange-800">
        <strong>Vui lòng hoàn thành bước 1!</strong> Bạn cần điền đầy đủ thông tin cá nhân trước khi tải lên tài liệu.
      </AlertDescription>
    </Alert>
  );

  // Document Guidelines Dialog
  const DocumentGuideDialog = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2">
          <HelpCircle className="h-4 w-4 mr-1" />
          Hướng dẫn
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Hướng dẫn tài liệu cần nộp</DialogTitle>
          <DialogDescription className="text-left space-y-3">
            <div>
              <strong className="text-gray-900">File PDF cần bao gồm:</strong>
            </div>
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <span className="text-blue-600 font-semibold">1.</span>
                <span><strong>CCCD/CMND:</strong> Ảnh rõ nét mặt trước và mặt sau của Căn cước công dân hoặc Chứng minh nhân dân</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-600 font-semibold">2.</span>
                <span><strong>Giấy phép kinh doanh:</strong> Bản sao có công chứng của Giấy chứng nhận đăng ký kinh doanh</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">
                <strong>Lưu ý:</strong> Vui lòng đảm bảo tất cả thông tin trong tài liệu rõ ràng, không bị mờ hoặc che khuất.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );

  // Show loading while checking seller profile
  if (isLoadingProfile) {
    return (
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Đăng ký trở thành người bán</h1>

      {showSuccessAlert && <SuccessAlert />}
      {showStep1RequiredAlert && <Step1RequiredAlert />}

      <Tabs value={step} onValueChange={setStep} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="step1">Bước 1: Thông tin cá nhân</TabsTrigger>
          <TabsTrigger value="step2">Bước 2: Tài liệu định danh</TabsTrigger>
        </TabsList>

        <TabsContent value="step1">
          <form onSubmit={(e) => {
            e.preventDefault();
            submitStep1(() => {
              setStep1Completed(true);
              setStep("step2");
              setShowStep1RequiredAlert(false);
            });
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
          <form onSubmit={handleSubmit(handleStep2Submit)}>
            <Card>
              <CardContent className="py-8 px-6 sm:px-8 space-y-6">
                <div>
                  <div className="flex items-center">
                    <Label htmlFor="pdfUpload">Tải lên file định danh (PDF)</Label>
                    <DocumentGuideDialog />
                  </div>
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