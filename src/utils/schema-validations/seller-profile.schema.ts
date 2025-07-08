import { z } from "zod";

export const UpdateSellerProfileSchema = z.object({
  fullName: z.string().min(1, "Vui lòng nhập họ và tên"),
  phoneNumber: z
    .string()
    .min(9, "Số điện thoại phải có ít nhất 9 số")
    .max(10, "Số điện thoại không được quá 10 số"),
  dateOfBirth: z.string().min(1, "Vui lòng chọn ngày sinh"),
  companyName: z.string().min(1, "Vui lòng nhập tên công ty"),
  taxId: z.string().min(1, "Vui lòng nhập mã số thuế"),
  companyAddress: z.string().min(1, "Vui lòng nhập địa chỉ công ty"),
});

export type UpdateSellerProfileType = z.infer<typeof UpdateSellerProfileSchema>;
