'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Truck, Tag } from 'lucide-react';
interface PaymentSummaryProps {
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
  isShip: boolean;
  onPlaceOrder: () => void;
  isLoading: boolean;
  itemCount: number;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  subtotal,
  discountAmount,
  shippingFee,
  total,
  isShip,
  onPlaceOrder,
  isLoading,
  itemCount
}) => {
  return (
    <Card className="shadow-lg lg:max-h-screen lg:overflow-y-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Tóm tắt thanh toán
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Số sản phẩm:</span>
            <span className="font-medium">{itemCount}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Tạm tính:</span>
            <span className="font-medium">{subtotal.toLocaleString('vi-VN')}₫</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span className="flex items-center gap-1">
                <Tag className="w-3 h-3" />
                Khuyến mãi:
              </span>
              <span className="font-medium">-{discountAmount.toLocaleString('vi-VN')}₫</span>
            </div>
          )}

          {isShip && (
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-1">
                <Truck className="w-3 h-3" />
                Phí vận chuyển:
              </span>
              <span className="font-medium">
                {shippingFee > 0 ? `${shippingFee.toLocaleString('vi-VN')}₫` : 'Miễn phí'}
              </span>
            </div>
          )}

          <div className="border-t pt-3">
            <div className="flex justify-between text-lg font-bold">
              <span>Tổng cộng:</span>
              <span className="text-red-600">{total.toLocaleString('vi-VN')}₫</span>
            </div>
          </div>
        </div>

        {isShip && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Truck className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="text-xs text-blue-700">
                <p className="font-medium">Giao hàng tận nơi</p>
                <p className="mt-1">Đơn hàng sẽ được giao đến địa chỉ của bạn</p>
              </div>
            </div>
          </div>
        )}

        <Button
          onClick={onPlaceOrder}
          disabled={isLoading || total <= 0}
          className="w-full h-12 text-base font-semibold"
          size="lg"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Đang xử lý...
            </div>
          ) : (
            `Đặt hàng`
          )}
        </Button>

        <div className="text-xs text-gray-500 text-center space-y-1">
          <p>🔒 Thanh toán an toàn với Stripe</p>
          <p>Thông tin của bạn được bảo mật tuyệt đối</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentSummary;
