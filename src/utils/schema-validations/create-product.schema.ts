import { z } from "zod";

export const CreateProductBody = z
  .object({
    name: z.string().min(1, "Tên sản phẩm không được để trống"),
    price: z.number().nonnegative("Giá sản phẩm phải lớn hơn hoặc bằng 0"), // Giá không âm
    category: z.number().int().min(0, "Vui lòng chọn danh mục"), // Số nguyên
    description: z.string().min(10, "Mô tả phải có ít nhất 10 ký tự"),
    contentType: z.number().int().min(0, "Loại nội dung không hợp lệ"), // Số nguyên
    totalPage: z.number().int().min(1, "Số trang không thể là 0"),
    unit: z.number().int().min(0, "Đơn vị không hợp lệ").optional(), // Đơn vị có thể = 0
    uploadType: z.number().int().min(0, "Loại tải lên không hợp lệ"), // Số nguyên, min = 0
    size: z.number().nonnegative("Kích thước phải lớn hơn hoặc bằng 0"), // Không âm

    mainImage: z
      .custom<File>((file) => file instanceof File, "Ảnh chính không hợp lệ")
      .nullable()
      .optional(), // Dữ liệu dạng File, cho phép rỗng

    file: z
      .custom<File>((file) => file instanceof File, "File tải lên không hợp lệ")
      .nullable()
      .optional(),

    filedemo: z
      .custom<File>((file) => file instanceof File, "File tải lên không hợp lệ")
      .nullable()
      .optional(),

    otherImages: z
      .array(
        z.custom<File>((file) => file instanceof File, "Ảnh khác không hợp lệ")
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
    // Nếu contentType là "Unit" (ví dụ: id của "Unit" là 0)
    if (data.contentType === 0) {
      // Kiểm tra nếu unit không tồn tại hoặc unit <= 0
      if (data.unit === undefined || data.unit <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Đơn vị phải lớn hơn 0",
          path: ["unit"],
        });
      }
    }

    // Nếu contentType là "Review" (ví dụ: id của "Review" là 1)
    if (data.contentType === 1) {
      // Kiểm tra nếu unit không phải là 0
      if (data.unit !== 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Đơn vị phải là 0 khi chọn Review",
          path: ["unit"],
        });
      }
    }
  });
export type CreateProductBodyType = z.infer<typeof CreateProductBody>;
