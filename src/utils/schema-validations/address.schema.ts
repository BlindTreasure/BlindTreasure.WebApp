import { z } from "zod";

export const createAddressSchema = z.object({
  fullName: z
    .string()
    .min(2, "Họ và tên phải có ít nhất 2 ký tự")
    .max(50, "Họ và tên không được quá 50 ký tự"),

  phone: z
    .string()
    .regex(
      /^(?:0|\+84)(?:3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$/,
      "Số điện thoại không hợp lệ"
    ),
  addressLine: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự"),

  city: z.string().min(1, "Vui lòng chọn thành phố"),

  province: z.string().min(1, "Vui lòng chọn tỉnh"),

  postalCode: z.string().optional(),
  ward: z.string().min(1, "Phường / Xã không được để trống"),
  district: z.string().min(1, "Quận / Huyện không được để trống"),
  isDefault: z.boolean().optional(),
});

export type TCreateAddressSchema = z.infer<typeof createAddressSchema>;
