"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaTimesCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button"
import { GoArrowLeft } from "react-icons/go";
import useToast from "@/hooks/use-toast";
import { useEffect } from "react";
export default function PaymentFailedPage() {
  const router = useRouter()
  const { addToast } = useToast();

  useEffect(() => {
    addToast({
      type: "error",
      description:
        "Thanh toán thất bại.",
      duration: 3500,
    });
  }, []);

  return (

    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
        <div className="flex justify-center">
          <FaTimesCircle className="text-8xl text-red-500" />
        </div>


        <h1 className="text-2xl font-bold text-gray-800 mt-4">
          Thanh Toán Thất Bại
        </h1>

        <p className="text-gray-600 mt-2">
          Rất tiếc, quá trình thanh toán của bạn không thành công. Vui lòng thử lại hoặc liên hệ với bộ phận hỗ trợ để được giúp đỡ.
        </p>

        <div>
          <Button className='bg-red-500 hover:bg-sky-700 mt-4' onClick={() => router.push('/')}> <GoArrowLeft />Quay về trang chủ</Button>
        </div>
      </div>
    </div>
  );
}