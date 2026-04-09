import { z } from 'zod';

export const envValidationSchema = z.object({
  PORT: z.string().default('8080'),
  MONGO_URI: z.string().url(),
  PRISMA_URL: z.string().url(),
  SECRET_KEY: z.string(),
  REFRESH_SECRET_KEY: z.string(),
  ACCESS_TOKEN_EXPIRES: z.string().default('2m'),
  DEFAULT_TOKEN_EXPIRES: z.string().default('5m'),
  REFRESH_TOKEN_EXPIRES: z.string().default('30d'),
  COOKIE_EXPIRES: z.string().default('30d'),
});

export const validateEnv = (config: Record<string, unknown>) =>
  envValidationSchema.parse(config);
