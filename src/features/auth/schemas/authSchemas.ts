import { z } from "zod";

export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, { error: "Please enter your email address!" })
    .email({ error: "Please enter a valid email!" }),
  password: z.string().min(6, { error: "Please enter your password!" }),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;