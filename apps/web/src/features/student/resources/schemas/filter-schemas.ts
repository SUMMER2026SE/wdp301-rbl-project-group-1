import { z } from "zod";

export const filterFormSchema = z.object({
  search: z.string().min(0).max(100),
  documentTypes: z.array(z.string()),
  categories: z.array(z.string()),
});

export type FilterFormValues = z.infer<typeof filterFormSchema>;
