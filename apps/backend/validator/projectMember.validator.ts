import { z } from "zod";

export const projectMemberSchema = z.object({
  userId: z.string().uuid(),
});
