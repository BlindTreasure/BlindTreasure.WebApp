import { z } from "zod";

export const createAddressSchema = z.object({
  fullName: z
    .string()
    .min(2, "Họ và tên phải có ít nhất 2 ký tự")
    .max(50, "Họ và tên không được quá 50 ký tự"),

  phone: z
    .string()
    .regex(/^(0|\+84)[0-9]{9}$/, "Số điện thoại không hợp lệ"),

  addressLine: z
    .string()
    .min(5, "Địa chỉ phải có ít nhất 5 ký tự"),

  city: z.string().min(1, "Vui lòng chọn thành phố"),

  province: z.string().min(1, "Vui lòng chọn tỉnh"),

  postalCode: z.string().optional(), 

  isDefault: z.boolean().optional(),
});

export type TCreateAddressSchema = z.infer<typeof createAddressSchema>;
