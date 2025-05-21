import { z } from "zod";

export const LoginBody = z
  .object({
    email: z.string().email(),
    password: z
      .string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .max(100),
  })
  .strict();

export type LoginBodyType = z.infer<typeof LoginBody>;

export const RegisterBody = z
  .object({
    email: z.string().email("Địa chỉ email không hợp lệ"),
    password: z
      .string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .max(100),
    confirmPassword: z
      .string()
      .min(6, "Xác nhận mật khẩu phải có ít nhất 6 ký tự")
      .max(100),
    fullName: z
      .string()
      .trim()
      .min(2, "Tên đầy đủ phải có ít nhất 2 ký tự")
      .max(256),
    dateOfBirth: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Định dạng ngày không hợp lệ",
      }),
    phoneNumber: z.string().refine(
      (val) => /^0\d{9}$/.test(val),
      { message: "Số điện thoại không hợp lệ" }
    ),
  })
  .strict()
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Mật khẩu không khớp",
        path: ["confirmPassword"],
      });
    }
  });

export type RegisterBodyType = z.TypeOf<typeof RegisterBody>;

export type RegisterBodyWithoutConfirm = Omit<RegisterBodyType, "confirmPassword">;