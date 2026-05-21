import { z } from "zod";

export const editProfileSchema = z.object({
  specialization: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  experience: z
    .number()
    .min(0, "Kinh nghiệm không được âm")
    .optional()
    .nullable(),
  bio: z.string().optional().nullable(),
});

export type EditProfileFormValues = z.infer<typeof editProfileSchema>;
