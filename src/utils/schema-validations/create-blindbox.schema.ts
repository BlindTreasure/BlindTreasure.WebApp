import { Rarity } from "@/const/products";
import { z } from "zod";

export const CreateBlindBox = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  description: z.string().min(1, "Mô tả không được để trống"),
  price: z.number().min(1, { message: "Giá phải lớn hơn 0" }),
  imageFile: z
    .union([
      z.instanceof(File, { message: "Vui lòng chọn file ảnh" }),
      z.string().url({ message: "Ảnh phải là URL hợp lệ" }),
    ])
    .optional()
    .nullable(),

  totalQuantity: z.number().int().min(1, "Số lượng tối thiểu là 1").optional(),

  releaseDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Ngày không hợp lệ",
    })
    .optional(),

  hasSecretItem: z.boolean().optional(),

  secretProbability: z
    .number()
    .min(0, "Xác suất phải ≥ 0")
    .max(100, "Xác suất phải ≤ 100")
    .optional(),
});

export type CreateBlindBoxBodyType = z.infer<typeof CreateBlindBox>;

export const BlindBoxItemSchema = z.object({
  productId: z.string().min(1, "Product ID không được để trống"),
  quantity: z
    .number()
    .int("Số lượng phải là số nguyên")
    .min(1, "Số lượng tối thiểu là 1"),
  dropRate: z
    .number()
    .min(0, "Drop rate không được nhỏ hơn 0")
    .max(100, "Drop rate không được lớn hơn 100"),
  rarity: z.nativeEnum(Rarity, {
    required_error: "Vui lòng chọn độ hiếm",
  }),
});

export type BlindBoxItem = z.infer<typeof BlindBoxItemSchema>;
