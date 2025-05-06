import { z } from "zod";

export const UpdateInfoProfileBody = z.object({
  firstName: z.string().trim().min(2).max(256),
  lastName: z.string().trim().min(2).max(256),
  phoneNumber: z.string().min(9).max(10),
});

export type UpdateInfoProfileBodyType = z.TypeOf<typeof UpdateInfoProfileBody>;
