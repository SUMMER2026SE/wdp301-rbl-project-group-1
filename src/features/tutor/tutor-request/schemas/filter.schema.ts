import { z } from "zod";

export const tutorRequestFilterSchema = z.object({
  subjects: z.array(z.string()),
  modes: z.array(z.string()),
  priceRange: z.tuple([z.number(), z.number()]),
  search: z.string(),
  sortBy: z.string(),
});

export type TutorRequestFilterFormData = z.infer<typeof tutorRequestFilterSchema>;
