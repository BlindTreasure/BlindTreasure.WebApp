import { z } from 'zod';
// Import enum từ file khác (cần adjust path cho đúng)
import { PromotionType } from '@/const/promotion';

// Zod schema cho validation
export const promotionSchema = z.object({
  code: z
    .string()
    .min(1, 'Mã promotion là bắt buộc')
    .trim(),
  
  description: z
    .string()
    .min(1, 'Mô tả là bắt buộc')
    .trim(),
  
  discountType: z.nativeEnum(PromotionType, {
    required_error: 'Loại giảm giá là bắt buộc',
    invalid_type_error: 'Loại giảm giá không hợp lệ'
  }),
  
  discountValue: z
    .number({
      required_error: 'Giá trị giảm giá là bắt buộc',
      invalid_type_error: 'Giá trị giảm giá phải là số'
    })
    .min(0.01, 'Giá trị giảm giá phải lớn hơn 0'),
  
  startDate: z
    .string()
    .min(1, 'Ngày bắt đầu là bắt buộc'),
  
  endDate: z
    .string()
    .min(1, 'Ngày kết thúc là bắt buộc'),
  
  usageLimit: z
    .number({
      required_error: 'Giới hạn sử dụng là bắt buộc',
      invalid_type_error: 'Giới hạn sử dụng phải là số'
    })
    .min(0, 'Giới hạn sử dụng không được âm')
}).refine(
  (data) => {
    if (data.discountType === PromotionType.Percentage) {
      return data.discountValue <= 100;
    }
    return true;
  },
  {
    message: 'Phần trăm giảm giá không được vượt quá 100%',
    path: ['discountValue']
  }
).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return new Date(data.startDate) < new Date(data.endDate);
    }
    return true;
  },
  {
    message: 'Ngày kết thúc phải sau ngày bắt đầu',
    path: ['endDate']
  }
);

// Type inference từ schema
export type PromotionFormData = z.infer<typeof promotionSchema>;

// Default values
export const defaultValues: PromotionFormData = {
  code: '',
  description: '',
  discountType: PromotionType.Percentage,
  discountValue: 0,
  startDate: '',
  endDate: '',
  usageLimit: 0
};