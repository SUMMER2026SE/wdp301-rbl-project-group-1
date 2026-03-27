import { z } from 'zod';

export const envValidationSchema = z.object({
  PORT: z.string().default('8080'),
  MONGO_URI: z.string().url(),
  PRISMA_URL: z.string().url(),
});

export const validateEnv = (config: Record<string, unknown>) =>
  envValidationSchema.parse(config);
