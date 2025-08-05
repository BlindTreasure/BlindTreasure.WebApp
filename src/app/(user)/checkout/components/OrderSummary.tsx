'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag } from 'lucide-react';

interface OrderSummaryProps {
  sellerItems: API.SellerCartGroup[];
  selectedItems: string[];
  quantities: Record<string, number>;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  sellerItems,
  selectedItems,
  quantities
}) => {
  const filteredSellerItems = sellerItems.map(sellerGroup => ({
    ...sellerGroup,
    items: sellerGroup.items.filter(item => selectedItems.includes(item.id))
  })).filter(sellerGroup => sellerGroup.items.length > 0);

  const totalItems = selectedItems.length;
  const totalShops = filteredSellerItems.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5" />
          Đơn hàng của bạn
        </CardTitle>
        <p className="text-sm text-gray-600">
          {totalItems} sản phẩm từ {totalShops} cửa hàng
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {filteredSellerItems.map((sellerGroup) => (
          <div key={sellerGroup.sellerId} className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h3 className="font-semibold text-sm text-gray-800">
                  🏪 {sellerGroup.sellerName}
                </h3>
                <p className="text-xs text-gray-600">
                  {sellerGroup.items.length} sản phẩm
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {sellerGroup.items.map((item) => {
                const isProduct = Boolean(item.productId);
                const name = isProduct ? item.productName : item.blindBoxName;
                const image = isProduct
                  ? item.productImages?.[0]
                  : item.blindBoxImage;
                const variant = isProduct ? 'Product' : 'Blindbox';
                const quantity = quantities[item.id] ?? item.quantity;

                return (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 border border-gray-200 rounded-lg bg-white"
                  >
                    <div className="flex-shrink-0">
                      <img
                        src={image || '/images/placeholder.jpg'}
                        alt={name || 'Sản phẩm'}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-gray-900 line-clamp-2">
                        {name}
                      </h4>

                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {variant}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="text-xs text-gray-600">
                          Số lượng: <span className="font-medium">{quantity}</span>
                        </div>
                        <div className="text-xs text-gray-600">
                          Đơn giá: <span className="font-medium">{item.unitPrice.toLocaleString('vi-VN')}₫</span>
                        </div>
                      </div>

                      <div className="text-right mt-1">
                        <span className="text-sm font-semibold text-red-600">
                          {(quantity * item.unitPrice).toLocaleString('vi-VN')}₫
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <span className="text-blue-500 text-sm">ℹ️</span>
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Lưu ý:</p>
              <ul className="space-y-1 text-xs">
                <li>• Đơn hàng sẽ được xử lý sau khi thanh toán thành công</li>
                <li>• Blindbox sẽ được lưu trong túi đồ để bạn mở sau</li>
                <li>• Bạn có thể thay đổi thông tin trước khi đặt hàng</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
