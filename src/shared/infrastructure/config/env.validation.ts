import { z } from 'zod';

export const envValidationSchema = z.object({
  PORT: z.string().default('8080'),
  MONGO_URI: z.string().url(),
  PRISMA_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  SECRET_KEY: z.string(),
  REFRESH_SECRET_KEY: z.string(),
  RESET_SECRET_KEY: z.string(),
  ACCESS_TOKEN_EXPIRES: z.string().default('2m'),
  DEFAULT_TOKEN_EXPIRES: z.string().default('5m'),
  REFRESH_TOKEN_EXPIRES: z.string().default('30d'),
  COOKIE_EXPIRES: z.string().default('30d'),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
  SUPABASE_URL: z.string().url(),
  SUPABASE_KEY: z.string(),
  SUPABASE_BUCKET: z.string(),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_REFRESH_TOKEN: z.string(),
  GOOGLE_REDIRECT_URI: z.string().url(),
  PAYOS_CLIENT_ID: z.string(),
  PAYOS_API_KEY: z.string(),
  PAYOS_CHECKSUM_KEY: z.string(),
  EMAIL_HOST: z.string(),
  EMAIL_PORT: z.string().default('587'),
  EMAIL_USER: z.string(),
  EMAIL_PASS: z.string(),
  RABBITMQ_URL: z.string().url(),
  AI_SERVICE_URL: z.string().url(),
});

export const validateEnv = (config: Record<string, unknown>) =>
  envValidationSchema.parse(config);
