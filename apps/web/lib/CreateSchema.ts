import {TypeOf, object, string } from "zod";

export const createUserSchema=object({
   email:string({error:"Email is required"})
       .min(1,"Email is required")
       .email("Invalid email address"),

   password:string({error:"Password is required"})
       .min(6,"Password must be at least 6 characters long")
       .max(32,"Password must be at most 32 characters long"),
})


export const loginUserSchema = object({
  email: string({ error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email or password"),
  password: string({ error: "Password is required" }).min(
    1,
    "Password is required"
  ),
});


export type LoginUserInput = TypeOf<typeof loginUserSchema>;
