'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GoArrowLeft } from "react-icons/go";
import { useAppDispatch } from '@/stores/store';
import { setCart } from '@/stores/cart-slice';
import { getCartByCustomer } from '@/services/cart-item/api-services';
import useToast from '@/hooks/use-toast';

export default function ThankYouPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('order_id');
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
            description:
                "Thanh toán thành công! Cảm ơn bạn đã đặt hàng. ",
            duration: 3500,
        });

    }, [dispatch]);

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-10 text-center">
            <div className="max-w-md bg-white shadow-lg rounded-2xl p-8">
                <div className="w-28 h-28 mx-auto mb-4 rounded-full bg-green-500 flex items-center justify-center">
                    <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-2">Cảm ơn bạn đã đặt hàng</h1>
                <p className="text-gray-600">
                    Thanh toán thành công! Chúng tôi đã nhận được đơn hàng của bạn.
                </p>

                {/* {orderId && (
          <div className="mt-6">
            <p className="text-gray-800 mb-2">
              Mã đơn hàng: <span className="font-semibold">{orderId}</span>
            </p>
            <Link
              href={`/order/${orderId}`}
              className="inline-block px-5 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
            >
              Xem đơn hàng của bạn
            </Link>
          </div>
        )} */}

                <Button className='bg-green-600 hover:bg-green-500 mt-4' onClick={() => router.push('/')}>
                    <GoArrowLeft /> Quay về trang chủ
                </Button>
            </div>
        </main>
    );
}
