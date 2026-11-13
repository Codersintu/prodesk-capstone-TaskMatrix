import z from "zod";

export const taskSchema=z.object({
    projectId:z.string().uuid(),
    assigneeId:z.string().uuid().nullable().optional(),
    title : z.string().trim().min(2).max(100),
    description: z.string().trim().nullable().optional(),
    priority:z.enum(["LOW", "MEDIUM","HIGH", "URGENT"]).optional(),
    status: z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]).optional(),
    startDate: z.coerce.date().nullable().optional(),
    dueDate: z.coerce.date().nullable().optional()
})

export type taskInput = z.infer<typeof taskSchema>

