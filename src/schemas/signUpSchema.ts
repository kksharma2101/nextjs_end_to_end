import { z } from "zod";

export const userNameValidation = z
    .string()
    .min(4, "Username must be 4 characters")
    .max(12, "Username not more than 12 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username not contain special characters");

export const signUpSchema = z.object({
    username: userNameValidation,
    email: z.string().email({ message: "Invalid email, check the email address" }),
    password: z.string().min(4, "Password minimum 4 character")
})