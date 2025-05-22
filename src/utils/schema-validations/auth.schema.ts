import { z } from "zod";

export const LoginBody = z
  .object({
    email: z.string().email("Địa chỉ email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự").max(100),
  })
  .strict();

export type LoginBodyType = z.infer<typeof LoginBody>;

const today = new Date();
const minDate = new Date(
  today.getFullYear() - 12,
  today.getMonth(),
  today.getDate()
);

export const RegisterBody = z
  .object({
    email: z.string().email("Địa chỉ email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự").max(100),
    confirmPassword: z
      .string()
      .min(6, "Xác nhận mật khẩu phải có ít nhất 6 ký tự")
      .max(100),
    fullName: z
      .string()
      .trim()
      .min(2, "Tên đầy đủ phải có ít nhất 2 ký tự")
      .max(256),
    dateOfBirth: z.string().refine(
      (value) => {
        const dob = new Date(value);
        const isInFuture = dob > today;
        const isTooYoung = dob > minDate;

        if (isInFuture) return false;
        if (isTooYoung) return false;

        return true;
      },
      {
        message:
          "Ngày sinh không hợp lệ: phải từ 12 tuổi trở lên và không được là ngày trong tương lai",
      }
    ),
    phoneNumber: z
      .string()
      .min(9, "Số điện thoại phải có 9 chữ số")
      .max(9, "Số điện thoại chỉ gồm 9 chữ số")
      .regex(/^[1-9][0-9]{8}$/, "Số điện thoại không hợp lệ (bỏ số 0 đầu)"),
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

export type RegisterBodyWithoutConfirm = Omit<
  RegisterBodyType,
  "confirmPassword"
>;
