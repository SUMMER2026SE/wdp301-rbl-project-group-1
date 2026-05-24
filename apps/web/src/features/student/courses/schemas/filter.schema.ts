import { z } from "zod";

export const coursesFilterSchema = z.object({
  subjects: z.array(z.string()),
  formats: z.array(z.string()),
  priceRange: z.tuple([z.number(), z.number()]),
  rating: z.number(),
  search: z.string(),
  sortBy: z.string(),
});

export type CoursesFilterFormData = z.infer<typeof coursesFilterSchema>;
