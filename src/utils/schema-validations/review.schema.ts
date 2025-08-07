import { z } from "zod";
export const reviewSchema = z
  .object({
    orderDetailId: z.string().min(1, "Order detail ID là bắt buộc"),

    rating: z
      .number({
        required_error: "Vui lòng chọn số sao đánh giá",
        invalid_type_error: "Rating phải là số",
      })
      .min(1, "Vui lòng chọn ít nhất 1 sao")
      .max(5, "Rating tối đa là 5 sao"),

    comment: z
      .string()
      .min(1, "Vui lòng viết nhận xét về sản phẩm")
      .min(10, "Nhận xét phải có ít nhất 10 ký tự")
      .max(1000, "Nhận xét không được vượt quá 1000 ký tự")
      .trim(),

    images: z.array(z.instanceof(File)).max(5, "Tối đa 5 files"),
    videos: z.array(z.instanceof(File)).max(5, "Tối đa 5 files").optional(),
  })
  .refine(
    (data) => {
      const totalFiles =
        (data.images?.length || 0) + (data.videos?.length || 0);
      return totalFiles <= 5;
    },
    {
      message: "Tổng số files (ảnh + video) không được vượt quá 5",
      path: ["images"], // Error sẽ hiển thị ở field images
    }
  );

export type ReviewFormData = z.infer<typeof reviewSchema>;

export const defaultValues: ReviewFormData = {
  orderDetailId: "",
  rating: 0,
  comment: "",
  images: [],
  videos: [],
};
