import { z } from "zod";

export const filterSchema = z.object({
  search: z.string(),
  subject: z.string(),
  status: z.string(),
});

export type FilterValues = z.infer<typeof filterSchema>;
