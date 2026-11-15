import z from "zod";

export const membershipSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
});

export type MembershipInput = z.infer<typeof membershipSchema>;