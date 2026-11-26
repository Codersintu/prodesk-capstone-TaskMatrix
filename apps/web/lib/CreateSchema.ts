import { z, object, string } from "zod";

export const createUserSchema = object({
  email: z
    .string({ error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email address"),

  password: string({ error: "Password is required" })
    .min(6, "Password must be at least 6 characters long")
    .max(32, "Password must be at most 32 characters long"),
});

export const loginUserSchema = object({
  email: z
    .string({ error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email or password"),
  password: z
    .string({ error: "Password is required" })
    .min(1, "Password is required"),
});

export const workspaceSchema = z.object({
  name: z
    .string({ error: "Workspace name is required" })
    .trim()
    .min(2, "Workspace name must be at least 2 characters")
    .max(20, "Workspace name must be at most 100 characters"),

  description: z
    .string()
    .trim()
    .max(500, "Description must be at most 500 characters")
    .optional(),
});

export const InvitationSchema = z.object({
  email: z.string({ error: "email is required" }).email("Invalid email"),
});

export const projectModelSchema = z.object({
  name: z
    .string({ error: "project name is required" })
    .trim()
    .min(2, "Project name must be at least 2 characters")
    .max(20, "Project must be at most 20 characters"),

  deadline: z.union([z.string().date(), z.literal("")]).optional(),

  description: z
    .string()
    .trim()
    .max(500, "Description must be at most 500 characters")
    .optional(),

  projectMemberIds: z
    .array(z.string().uuid())
    .max(50)
    .refine((ids) => new Set(ids).size === ids.length, {
      message: "Member IDs must not contain duplicates",
    })
    .optional()
    .default([]),
}); 

export const addMemberSchema= z.object({
    userId:z.string().uuid()
});

export type addMemberSchemaInput= z.infer<typeof addMemberSchema>;
export type ProjectModelFormInput = z.input<typeof projectModelSchema>;
export type projectModelInput = z.output<typeof projectModelSchema>;
export type InvitationInput = z.infer<typeof InvitationSchema>;
export type WorkspaceInput = z.infer<typeof workspaceSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
