import { z } from "zod";

export const UpdateInfoProfileBody = z.object({
  // fullName: z.string().trim().min(2).max(256),
  fullName: z
    .string()
    .trim()
    .min(2, "Họ tên phải có ít nhất 2 ký tự")
    .max(256, "Họ tên không được vượt quá 256 ký tự"),
  // phoneNumber: z.string().min(9).max(10),
  phoneNumber: z
    .string()
    .regex(
      /^(0[3|5|7|8|9])[0-9]{8}$/,
      "Số điện thoại không hợp lệ (phải gồm 10 chữ số, bắt đầu bằng 03, 05, 07, 08 hoặc 09)"
    ),
  email: z.string().email(),
  gender: z.boolean().nullable(),
});

export type UpdateInfoProfileBodyType = z.TypeOf<typeof UpdateInfoProfileBody>;
