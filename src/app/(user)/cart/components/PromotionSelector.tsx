'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tag, X } from 'lucide-react';
import useGetPromotions from '../hooks/useGetPromotions';
import { Promotion } from '@/services/promotion/typing';
import { DiscountType } from '@/const/promotion';

interface PromotionSelectorProps {
  selectedPromotionId: string | null;
  onPromotionChange: (promotionId: string | null, promotion?: Promotion) => void;
  sellerId?: string;
  subtotal: number;
}

const PromotionSelector: React.FC<PromotionSelectorProps> = ({
  selectedPromotionId,
  onPromotionChange,
  sellerId,
  subtotal
}) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const { getPromotionsApi, isPending } = useGetPromotions();
  useEffect(() => {
    setHasLoaded(false);
    setPromotions([]);
  }, [sellerId]);

  useEffect(() => {
    if (hasLoaded) return;

    const loadPromotions = async () => {
      const result = await getPromotionsApi(sellerId);
      if (result?.value?.data?.result) {
        setPromotions(result.value.data.result);
        setHasLoaded(true);
      }
    };
    loadPromotions();
  }, [sellerId, getPromotionsApi, hasLoaded]);

  const promotionsData = promotions || [];
  const selectedPromotion = promotionsData.find(p => p.id === selectedPromotionId);

  const calculateDiscount = (promotion: Promotion, amount: number): number => {
    if (promotion.discountType === DiscountType.Percentage) {
      return Math.min((amount * promotion.discountValue) / 100, amount);
    } else {
      return Math.min(promotion.discountValue, amount);
    }
  };

  const validPromotions = promotionsData.filter(promotion => {
    const now = new Date();
    const endDate = new Date(promotion.endDate);
    const startDate = new Date(promotion.startDate);
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return startDate <= sevenDaysFromNow && endDate >= now;
  });

  const handleSelectPromotion = (promotion: Promotion) => {
    const now = new Date();
    const startDate = new Date(promotion.startDate);

    if (startDate > now) return;

    onPromotionChange(promotion.id, promotion);
    setIsModalOpen(false);
  };

  const handleRemovePromotion = () => {
    onPromotionChange(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-blue-600" />
          <h3 className="font-medium text-sm">Mã Voucher</h3>
        </div>

        {validPromotions.length > 0 ? (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs">
                Chọn Voucher ({validPromotions.length})
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
              <DialogHeader>
                <DialogTitle>Chọn mã khuyến mãi</DialogTitle>
              </DialogHeader>
              <div className="max-h-[60vh] overflow-y-auto">
                <div className="space-y-3 p-1">
                  <div className="text-xs text-gray-600 mb-2 flex items-center gap-1">
                    <span>💡</span>
                    <span>Click vào mã bên dưới để áp dụng ngay:</span>
                  </div>
                  {validPromotions.map((promotion) => {
                    const discount = calculateDiscount(promotion, subtotal);
                    const isSelected = selectedPromotionId === promotion.id;
                    const now = new Date();
                    const startDate = new Date(promotion.startDate);
                    const isUpcoming = startDate > now;

                    return (
                      <div
                        key={promotion.id}
                        className={`p-3 border rounded cursor-pointer transition-all hover:shadow-sm ${isUpcoming
                          ? 'border-orange-200 bg-orange-50 cursor-not-allowed opacity-75'
                          : isSelected
                            ? 'border-blue-500 bg-blue-50 cursor-pointer'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 cursor-pointer hover:shadow-sm'
                          }`}
                        title={isUpcoming ? 'Mã này chưa có hiệu lực' : 'Click để áp dụng mã này'}
                        onClick={() => !isUpcoming && handleSelectPromotion(promotion)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="secondary" className="text-xs font-mono">
                                {promotion.code}
                              </Badge>
                              <span className="text-xs font-medium text-blue-600">
                                -{promotion.discountType === DiscountType.Percentage
                                  ? `${promotion.discountValue}%`
                                  : `${promotion.discountValue.toLocaleString('vi-VN')}₫`}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {promotion.description}
                            </p>
                            {isUpcoming && (
                              <p className="text-xs text-orange-600 mt-1">
                                Bắt đầu: {startDate.toLocaleDateString('vi-VN')}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              Giảm: {discount.toLocaleString('vi-VN')}₫
                            </p>
                          </div>
                          {!isSelected && (
                            <div className={`text-xs font-medium ${isUpcoming
                              ? 'text-orange-600'
                              : 'text-blue-600'
                              }`}>
                              {isUpcoming ? 'Chưa có hiệu lực' : 'Click để chọn'}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <div className="text-xs text-gray-500">
            {isPending ? 'Đang tải mã khuyến mãi...' : 'Hiện tại không có mã khuyến mãi nào'}
          </div>
        )}
      </div>

      {selectedPromotion && (
        <Card className="border-green-500 bg-green-50">
          <CardContent className="p-3">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-green-600 text-xs font-mono">
                    {selectedPromotion.code}
                  </Badge>
                  <span className="text-xs font-medium text-green-700">
                    -{selectedPromotion.discountType === DiscountType.Percentage
                      ? `${selectedPromotion.discountValue}%`
                      : `${selectedPromotion.discountValue.toLocaleString('vi-VN')}₫`}
                  </span>
                </div>
                <p className="text-xs text-green-700 mt-1">
                  {selectedPromotion.description}
                </p>
                <p className="text-xs font-medium text-green-800 mt-1">
                  Tiết kiệm: {calculateDiscount(selectedPromotion, subtotal).toLocaleString('vi-VN')}₫
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemovePromotion}
                className="h-6 w-6 p-0 text-green-600 hover:text-green-800 hover:bg-green-100"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PromotionSelector;
