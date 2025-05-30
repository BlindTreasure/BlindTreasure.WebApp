import { z } from "zod";

export const RegisterSellerStep1Schema = z.object({
  fullName: z.string().min(1, "Vui lòng nhập họ và tên"),
  phoneNumber: z.string().min(1, "Vui lòng nhập số điện thoại"),
  dateOfBirth: z.string().min(1, "Vui lòng chọn ngày sinh"),
  companyName: z.string().min(1, "Vui lòng nhập tên công ty"),
  taxId: z.string().min(1, "Vui lòng nhập mã số thuế"),
  companyAddress: z.string().min(1, "Vui lòng nhập địa chỉ công ty"),
});

export type RegisterSellerStep1Type = z.infer<typeof RegisterSellerStep1Schema>;
