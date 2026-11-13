import z from "zod";

export const membershipSchema=z.object({
    workspaceId:z.string().uuid(),
    role:z.enum(["OWNER", "ADMIN","MEMBER"]).optional(),
    status: z.enum(["INVITED", "ACTIVE", "SUSPENDED"]).optional(),
    joinedAt: z.coerce.date().nullable().optional(),
})


 export type MembershipInput = z.infer<typeof membershipSchema>;

