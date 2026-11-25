import z from "zod";

export const projectSchema=z.object({
    workspaceId:z.string().uuid(),
    name : z.string().trim().min(2).max(100),
    description: z.string().trim().optional(),
    status: z.enum(["ACTIVE", "COMPLETED", "ARCHIVED"]).optional(),
    deadline: z.coerce.date().nullable().optional(),
    projectMemberIds: z.array(z.string().uuid()).max(50)
            .refine((ids) => new Set(ids).size === ids.length, {
                message: "Member IDs must not contain duplicates",
            })
            .optional()
            .default([]),
})

export type projectInput = z.infer<typeof projectSchema>

