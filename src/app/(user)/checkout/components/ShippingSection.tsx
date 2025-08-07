'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Truck } from 'lucide-react';
import usePreviewShipping from '../../cart/hooks/usePreviewShipping';

interface ShippingSectionProps {
  sellerItems: API.SellerCartGroup[];
  selectedItems: string[];
  quantities: Record<string, number>;
  sellerPromotions: Record<string, { promotionId: string | null; promotion: any | null }>;
  onShippingChange: (enabled: boolean, data?: API.ShipmentPreview[] | null, address?: any) => void;
}

const ShippingSection: React.FC<ShippingSectionProps> = ({
  sellerItems,
  selectedItems,
  quantities,
  sellerPromotions,
  onShippingChange
}) => {
  const [isShip, setIsShip] = useState(false);

  const [shippingData, setShippingData] = useState<API.ShipmentPreview[] | null>(null);

  const { previewShipping, isPending: isLoadingShipping } = usePreviewShipping();

  useEffect(() => {
    const fetchShippingPreview = async () => {
      if (!isShip || selectedItems.length === 0) {
        setShippingData(null);
        onShippingChange(false);
        return;
      }

      const orderSellerItems: REQUEST.CreateOrderSellerGroup[] = sellerItems
        .map(sellerGroup => {
          const filteredItems = sellerGroup.items
            .filter(item => selectedItems.includes(item.id))
            .map(item => ({
              id: item.id,
              productId: item.productId ?? "",
              productName: item.productName ?? "",
              productImages: item.productImages,
              blindBoxId: item.blindBoxId ?? "",
              blindBoxName: item.blindBoxName ?? "",
              blindBoxImage: item.blindBoxImage,
              quantity: quantities[item.id] ?? item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: (quantities[item.id] ?? item.quantity) * item.unitPrice,
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
        isShip: true,
      };

      try {
        const result = await previewShipping(payload);
        setShippingData(result);
        onShippingChange(true, result);
      } catch (error) {
        console.error('Error fetching shipping preview:', error);
        setShippingData(null);
        onShippingChange(false);
      }
    };

    if (isShip) {
      fetchShippingPreview();
    } else {
      setShippingData(null);
      onShippingChange(false);
    }
  }, [isShip, selectedItems, quantities, sellerPromotions]);

  const handleShippingToggle = (checked: boolean) => {
    setIsShip(checked);
  };

  const hasBlindboxItems = sellerItems
    .flatMap(seller => seller.items)
    .some(item => selectedItems.includes(item.id) && !Boolean(item.productId));
  const selectedItemsData = sellerItems
    .flatMap(seller => seller.items)
    .filter(item => selectedItems.includes(item.id));
  const hasOnlyBlindboxItems = selectedItemsData.length > 0 &&
    selectedItemsData.every(item => !Boolean(item.productId));
  if (hasOnlyBlindboxItems) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="w-5 h-5" />
          Giao hàng
        </CardTitle>
        <p className="text-sm text-gray-600">
          Chọn phương thức nhận hàng
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="shipping-option"
            checked={isShip}
            onCheckedChange={handleShippingToggle}
          />
          <label htmlFor="shipping-option" className="text-sm font-medium flex items-center gap-2">
            <Truck className="w-4 h-4" />
            Giao hàng tận nơi
          </label>
        </div>

        {isShip && isLoadingShipping && (
          <div className="text-sm text-gray-500 ml-6">
            Đang tính phí vận chuyển...
          </div>
        )}

        {isShip && shippingData && !isLoadingShipping && (
          <div className="ml-6 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-sm text-green-700">
              <p className="font-medium">Phí vận chuyển:</p>
              {shippingData.map((shipment, index) => (
                <div key={index} className="mt-1">
                  <span>{shipment.ghnPreviewResponse.totalFee.toLocaleString('vi-VN')}₫</span>
                  <span className="text-xs ml-2">(Giao hàng nhanh)</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {isShip && hasBlindboxItems && (
          <div className="text-xs px-3 py-2 bg-amber-50 border border-amber-200 rounded text-amber-700 flex items-center gap-2 ml-6">
            <span>⚠️</span>
            <span>Lưu ý: Sản phẩm blindbox chỉ được giao sau khi bạn mở hộp và nhận sản phẩm cụ thể.</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ShippingSection;
