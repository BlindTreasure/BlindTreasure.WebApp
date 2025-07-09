import { z } from "zod";

export const UpdateSellerProfileSchema = z.object({
  fullName: z.string().min(1, "Vui lòng nhập họ và tên"),
  phoneNumber: z
    .string()
    .min(9, "Số điện thoại phải có ít nhất 9 số")
    .max(10, "Số điện thoại không được quá 10 số"),
  dateOfBirth: z
    .string()
    .min(1, "Vui lòng chọn ngày sinh")
    .refine((date) => {
      // Validate date format first
      const birthDate = new Date(date);
      if (isNaN(birthDate.getTime())) {
        return false;
      }

      const today = new Date();

      // Ensure birth date is not in the future
      if (birthDate > today) {
        return false;
      }

      // Calculate exact age
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      const exactAge =
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
          ? age - 1
          : age;

      return exactAge >= 18;
    }, "Bạn phải đủ 18 tuổi để đăng ký làm người bán"),
  companyName: z.string().min(1, "Vui lòng nhập tên công ty"),
  taxId: z.string().min(1, "Vui lòng nhập mã số thuế"),
  companyAddress: z.string().min(1, "Vui lòng nhập địa chỉ công ty"),
});

export type UpdateSellerProfileType = z.infer<typeof UpdateSellerProfileSchema>;
