import z from "zod";

export const taskcommentSchema=z.object({
    content: z.string().trim().min(1)
});

export type taskCommentInput= z.infer<typeof taskcommentSchema>;