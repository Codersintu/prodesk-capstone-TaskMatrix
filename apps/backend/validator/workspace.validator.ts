import z from "zod";

export const workspaceSchema=z.object({
    name : z.string().trim().min(2).max(100),
    description: z.string().trim().optional(),
})


 export type WorkspaceInput = z.infer<typeof workspaceSchema>;

