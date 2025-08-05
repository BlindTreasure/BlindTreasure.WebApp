'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tag } from 'lucide-react';
import { Promotion } from '@/services/promotion/typing';
import PromotionSelector from '../../cart/components/PromotionSelector';

interface PromotionSectionProps {
  selectedPromotionId: string | null;
  onPromotionChange: (promotionId: string | null, promotion?: Promotion) => void;
  subtotal: number;
}

const PromotionSection: React.FC<PromotionSectionProps> = ({
  selectedPromotionId,
  onPromotionChange,
  subtotal
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="w-5 h-5" />
          Mã khuyến mãi
        </CardTitle>
        <p className="text-sm text-gray-600">
          Áp dụng mã khuyến mãi để được giảm giá
        </p>
      </CardHeader>
      <CardContent>
        <PromotionSelector
          selectedPromotionId={selectedPromotionId}
          onPromotionChange={onPromotionChange}
          subtotal={subtotal}
          sellerId={undefined} 
        />
      </CardContent>
    </Card>
  );
};

export default PromotionSection;
