import z from "zod";

export const taskcommentSchema=z.object({
    content: z.string().trim().min(1).max(500),
});

export type taskCommentInput= z.infer<typeof taskcommentSchema>;