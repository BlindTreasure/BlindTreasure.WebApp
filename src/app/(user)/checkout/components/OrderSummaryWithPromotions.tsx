'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Store } from 'lucide-react';
import PromotionSelector from '../../cart/components/PromotionSelector';
import { Promotion } from '@/services/promotion/typing';

interface OrderSummaryWithPromotionsProps {
  sellerItems: API.SellerCartGroup[];
  selectedItems: string[];
  quantities: Record<string, number>;
  sellerPromotions: Record<string, { promotionId: string | null; promotion: Promotion | null }>;
  onPromotionChange: (sellerId: string, promotionId: string | null, promotion?: Promotion) => void;
}

const OrderSummaryWithPromotions: React.FC<OrderSummaryWithPromotionsProps> = ({
  sellerItems,
  selectedItems,
  quantities,
  sellerPromotions,
  onPromotionChange
}) => {
  const sellersWithSelectedItems = sellerItems.filter(seller =>
    seller.items.some(item => selectedItems.includes(item.id))
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5" />
          Tóm tắt đơn hàng
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {sellersWithSelectedItems.map((seller) => {
          const selectedSellerItems = seller.items.filter(item =>
            selectedItems.includes(item.id)
          );

          const sellerSubtotal = selectedSellerItems.reduce((sum, item) => {
            const quantity = quantities[item.id] || item.quantity;
            return sum + (quantity * item.unitPrice);
          }, 0);

          const sellerPromotion = sellerPromotions[seller.sellerId];

          return (
            <div key={seller.sellerId} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Store className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-sm">{seller.sellerName}</span>
                <span className="text-xs text-gray-500">
                  ({selectedSellerItems.length} sản phẩm)
                </span>
              </div>

              <div className="space-y-3">
                {selectedSellerItems.map((item) => {
                  const quantity = quantities[item.id] || item.quantity;
                  const itemTotal = quantity * item.unitPrice;

                  return (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                        <img
                          src={item.productImages?.[0] || item.blindBoxImage || '/placeholder.jpg'}
                          alt={item.productName || item.blindBoxName || 'Product'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium line-clamp-2">
                          {item.productName || item.blindBoxName}
                        </h4>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-gray-500">
                            {item.unitPrice.toLocaleString('vi-VN')}₫ × {quantity}
                          </span>
                          <span className="text-sm font-medium">
                            {itemTotal.toLocaleString('vi-VN')}₫
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-2 border-t text-sm">
                <span>Tạm tính ({seller.sellerName}):</span>
                <span className="font-medium">
                  {sellerSubtotal.toLocaleString('vi-VN')}₫
                </span>
              </div>

              <div className="pt-2 border-t">
                <PromotionSelector
                  selectedPromotionId={sellerPromotion?.promotionId || null}
                  onPromotionChange={(promotionId, promotion) =>
                    onPromotionChange(seller.sellerId, promotionId, promotion)
                  }
                  sellerId={seller.sellerId}
                  subtotal={sellerSubtotal}
                />
              </div>
            </div>
          );
        })}

        {sellersWithSelectedItems.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Chưa có sản phẩm nào được chọn</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderSummaryWithPromotions;
