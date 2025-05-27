import { z } from "zod";

export const UpdateInfoProfileBody = z.object({
  fullName: z.string().trim().min(2).max(256),
  phoneNumber: z.string().min(9).max(10),
  email: z.string().email(),
  gender: z.boolean().nullable(),
});

export type UpdateInfoProfileBodyType = z.TypeOf<typeof UpdateInfoProfileBody>;
