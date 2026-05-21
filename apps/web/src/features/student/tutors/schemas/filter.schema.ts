import { z } from "zod";

export const filterSchema = z.object({
  subjects: z.array(z.string()),
  levels: z.array(z.string()),
  priceRange: z.tuple([z.number(), z.number()]),
  rating: z.number(),
  search: z.string(),
  sortBy: z.string(),
});

export type FilterFormData = z.infer<typeof filterSchema>;
