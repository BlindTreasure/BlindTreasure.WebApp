import { z } from "zod";

export const UpdateEmailBody = z.object({
  email: z.string().email(),
});

export type UpdateEmailBodyType = z.TypeOf<typeof UpdateEmailBody>;
