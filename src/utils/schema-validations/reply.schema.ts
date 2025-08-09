import { z } from "zod";

export const replySchema = z.object({
  content: z
    .string()
    .min(1, "Nội dung phản hồi không được để trống")
    .min(5, "Phản hồi phải có ít nhất 5 ký tự")
    .max(1000, "Phản hồi không được vượt quá 1000 ký tự")
    .trim(),
});

export type ReplyFormData = z.infer<typeof replySchema>;

export const defaultValues: ReplyFormData = {
  content: "",
};
