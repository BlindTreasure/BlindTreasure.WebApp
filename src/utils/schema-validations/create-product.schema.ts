import { ProductType, Status } from "@/const/products";
import { z } from "zod";

export const CreateProductBody = z
  .object({
    name: z.string().min(1, { message: "Tên sản phẩm là bắt buộc" }),
    description: z.string().min(1, { message: "Mô tả là bắt buộc" }),
    categoryId: z.string().uuid({ message: "CategoryId không hợp lệ" }),
    price: z.number().min(1, { message: "Giá phải lớn hơn 0" }),
    stock: z
      .number()
      .int()
      .min(0, { message: "Số lượng phải là số nguyên lớn hơn hoặc bằng 0" }),
    status: z.nativeEnum(Status, {
      errorMap: () => ({ message: "Trạng thái không hợp lệ" }),
    }),
    height: z.number().optional(),
    material: z.string().optional(),
    productType: z.nativeEnum(ProductType).nullable().optional(),
    brand: z.string().optional(),
    images: z
      .array(
        z.union([
          z.instanceof(File, { message: "Vui lòng chọn file ảnh" }),
          z.string().url({ message: "Ảnh phải là URL hợp lệ" }),
        ])
      )
      .optional(),
  })
  .strict();

export type CreateProductBodyType = z.infer<typeof CreateProductBody>;

export const UpdateProductImages = z.object({
  images: z
    .array(
      z.union([
        z.instanceof(File, { message: "Vui lòng chọn file ảnh hợp lệ" }),
        z.string().url({ message: "Ảnh phải là URL hợp lệ" }),
      ])
    )
    .min(1, { message: "Phải có ít nhất 1 ảnh" }),
});

export type UpdateProductImagesType = z.infer<typeof UpdateProductImages>;