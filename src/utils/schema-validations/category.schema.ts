import { z } from "zod";

export const CreateCategoryBody = z
  .object({
    name: z.string().min(1, { message: "Cần phải nhập tên cho Category" }),
    description: z.string().min(1, { message: "Cần phải nhập miêu tả cho Category" }),

    parentId: z.string().optional().nullable(), // có thể không có danh mục cha

    imageUrl: z
      .union([
        z.custom<File>((file) => file instanceof File),
        z.string().url(), // ✅ Cho phép string URL (cho trường hợp update)
        z.undefined()
      ])
      .optional()
      .nullable(),
  })
  .strict()
  .refine((data) => {
    // ✅ Nếu có parentId (subcategory) thì không bắt buộc có ảnh
    if (data.parentId) {
      return true;
    }
    // ✅ Nếu không có parentId (root category) thì bắt buộc phải có ảnh
    return data.imageUrl !== undefined && data.imageUrl !== null;
  }, {
    message: "Danh mục gốc phải có ảnh đại diện",
    path: ["imageUrl"] // ✅ Lỗi sẽ hiển thị ở field imageUrl
  });

export type CreateCategoryBodyType = z.infer<typeof CreateCategoryBody>;