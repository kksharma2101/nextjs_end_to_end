import { z } from "zod";

export const messageSchema = z.object({
    content: z.string().min(10, "Message atleast 10 characters")
})