'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import useToast from '@/hooks/use-toast';
import useCreateOrder from '../../cart/hooks/useCreateOrder';
import { Promotion } from '@/services/promotion/typing';
import { DiscountType } from '@/const/promotion';
import OrderSummaryWithPromotions from './OrderSummaryWithPromotions';
import ShippingSection from './ShippingSection';
import PaymentSummary from './PaymentSummary';

interface CheckoutData {
  selectedItems: string[];
  sellerItems: API.SellerCartGroup[];
  quantities: Record<string, number>;
  subtotal: number;
}

const CheckoutForm: React.FC = () => {
  const router = useRouter();
  const { addToast } = useToast();
  const { createOrder, isPending: isCreatingOrder } = useCreateOrder();

  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [sellerPromotions, setSellerPromotions] = useState<Record<string, { promotionId: string | null; promotion: Promotion | null }>>({});
  const [isShip, setIsShip] = useState(false);
  const [shippingData, setShippingData] = useState<API.ShipmentPreview[] | null>(null);


  useEffect(() => {
    const savedData = localStorage.getItem('checkoutData');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setCheckoutData(data);
      } catch (error) {
        router.push('/cart');
      }
    } else {
      router.push('/cart');
    }
  }, [router]);

  const calculateDiscount = (promotion: Promotion, amount: number): number => {
    if (promotion.discountType === DiscountType.Percentage) {
      return Math.min((amount * promotion.discountValue) / 100, amount);
    } else {
      return Math.min(promotion.discountValue, amount);
    }
  };

  const discountAmount = useMemo(() => {
    if (!checkoutData) return 0;

    let totalDiscount = 0;

    Object.entries(sellerPromotions).forEach(([sellerId, sellerPromo]) => {
      if (sellerPromo.promotion) {
        const sellerSubtotal = checkoutData.sellerItems
          .filter(seller => seller.sellerId === sellerId)
          .reduce((sum, seller) => {
            return sum + seller.items
              .filter(item => checkoutData.selectedItems.includes(item.id))
              .reduce((itemSum, item) => {
                const quantity = checkoutData.quantities[item.id] || item.quantity;
                return itemSum + (quantity * item.unitPrice);
              }, 0);
          }, 0);
        const sellerDiscount = calculateDiscount(sellerPromo.promotion, sellerSubtotal);
        totalDiscount += sellerDiscount;
      }
    });

    return totalDiscount;
  }, [sellerPromotions, checkoutData]);

  const totalShippingFee = useMemo(() => {
    return isShip && shippingData
      ? shippingData.reduce((acc, shipment) => acc + shipment.ghnPreviewResponse.totalFee, 0)
      : 0;
  }, [isShip, shippingData]);

  const finalTotal = useMemo(() => {
    if (!checkoutData) return 0;
    return checkoutData.subtotal - discountAmount + totalShippingFee;
  }, [checkoutData, discountAmount, totalShippingFee]);

  const handlePromotionChange = (sellerId: string, promotionId: string | null, promotion?: Promotion) => {
    setSellerPromotions(prev => ({
      ...prev,
      [sellerId]: {
        promotionId,
        promotion: promotion || null
      }
    }));
  };

  const handleShippingChange = (enabled: boolean, data?: API.ShipmentPreview[] | null) => {
    setIsShip(enabled);
    setShippingData(data || null);
  };

  const handlePlaceOrder = async () => {
    if (!checkoutData) return;

    try {
      const orderSellerItems: REQUEST.CreateOrderSellerGroup[] = checkoutData.sellerItems
        .map(sellerGroup => {
          const filteredItems = sellerGroup.items
            .filter(item => checkoutData.selectedItems.includes(item.id))
            .map(item => ({
              id: item.id,
              productId: item.productId ?? "",
              productName: item.productName ?? "",
              productImages: item.productImages,
              blindBoxId: item.blindBoxId ?? "",
              blindBoxName: item.blindBoxName ?? "",
              blindBoxImage: item.blindBoxImage,
              quantity: checkoutData.quantities[item.id] ?? item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: (checkoutData.quantities[item.id] ?? item.quantity) * item.unitPrice,
              createdAt: item.createdAt,
            }));

          const sellerPromotion = sellerPromotions[sellerGroup.sellerId];

          return {
            sellerId: sellerGroup.sellerId,
            sellerName: sellerGroup.sellerName,
            items: filteredItems,
            ...(sellerPromotion?.promotionId && { promotionId: sellerPromotion.promotionId }),
          };
        })
        .filter(sellerGroup => sellerGroup.items.length > 0);

      const payload: REQUEST.CreateOrderList = {
        sellerItems: orderSellerItems,
        isShip,
      };

      const url = await createOrder(payload);
      if (url) {
        localStorage.removeItem('checkoutData');
        window.location.href = url;
      }
    } catch (error) {
      addToast({
        type: 'error',
        description: 'Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.',
        duration: 5000,
      });
    }
  };

  if (!checkoutData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Đang tải thông tin đơn hàng...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-4 lg:py-8 mt-16 lg:mt-40">
        <div className="mb-4 lg:mb-8">
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Thanh toán</h1>
          <p className="text-sm lg:text-base text-gray-600 mt-1 lg:mt-2">Xem lại đơn hàng và hoàn tất thanh toán</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-4 lg:space-y-6">
            <OrderSummaryWithPromotions
              sellerItems={checkoutData.sellerItems}
              selectedItems={checkoutData.selectedItems}
              quantities={checkoutData.quantities}
              sellerPromotions={sellerPromotions}
              onPromotionChange={handlePromotionChange}
            />

            <ShippingSection
              sellerItems={checkoutData.sellerItems}
              selectedItems={checkoutData.selectedItems}
              quantities={checkoutData.quantities}
              sellerPromotions={sellerPromotions}
              onShippingChange={handleShippingChange}
            />
          </div>

          <div className="lg:col-span-1">
            <div className="relative lg:sticky lg:top-32 mt-6 lg:mt-0">
              <PaymentSummary
                subtotal={checkoutData.subtotal}
                discountAmount={discountAmount}
                shippingFee={totalShippingFee}
                total={finalTotal}
                isShip={isShip}
                onPlaceOrder={handlePlaceOrder}
                isLoading={isCreatingOrder}
                itemCount={checkoutData.selectedItems.reduce((sum, itemId) => sum + (checkoutData.quantities[itemId] || 1), 0)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
