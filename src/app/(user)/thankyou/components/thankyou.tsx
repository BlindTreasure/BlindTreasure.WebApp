"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GoArrowLeft } from "react-icons/go";
import { useAppDispatch } from "@/stores/store";
import { setCart } from "@/stores/cart-slice";
import { getCartByCustomer } from "@/services/cart-item/api-services";
import useToast from "@/hooks/use-toast";
import { CheckCircle2 } from "lucide-react";

export default function ThankYouPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("order_id");
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { addToast } = useToast();

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await getCartByCustomer();
                if (response?.isSuccess) {
                    dispatch(setCart(response.value.data.items ?? []));
                }
            } catch (error) {
                console.error("Lỗi lấy lại giỏ hàng:", error);
            }
        };
        fetchCart();

        addToast({
            type: "success",
            description: "Thanh toán thành công! Cảm ơn bạn đã đặt hàng.",
            duration: 3500,
        });
    }, [dispatch]);

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
            <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
                <div className="flex justify-center">
                    <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="w-16 h-16 text-green-600" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-800">
                    Cảm ơn bạn đã đặt hàng!
                </h1>
                <p className="text-gray-600 text-sm">
                    Đơn hàng của bạn đã được xác nhận và đang được xử lý. Chúng tôi sẽ sớm gửi đến bạn.
                </p>

                <div className="flex flex-col items-center gap-3 mt-4">
                    {orderId && (
                        <Button
                            onClick={() => router.push(`/orderhistory/${orderId}`)}
                            className="w-full max-w-xs bg-green-600 hover:bg-green-700 text-white"
                        >
                            Xem đơn hàng của bạn
                        </Button>
                    )}

                    <Button
                        variant="outline"
                        className="w-full max-w-xs text-gray-700 border-gray-300 hover:bg-gray-100"
                        onClick={() => router.push("/")}
                    >
                        <GoArrowLeft className="mr-2 h-4 w-4" />
                        Quay về trang chủ
                    </Button>
                </div>
            </div>
        </main>
    );
}
