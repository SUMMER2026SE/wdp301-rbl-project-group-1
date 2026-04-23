import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';

export const VerifyOtpSchema = z
  .object({
    email: z.string().email().meta({
      example: 'user@example.com',
      description: 'The email address of the user',
    }),
    code: z.string().min(6).max(6).meta({
      example: '123456',
      description: 'The 6-digit OTP code',
    }),
  })
  .meta({ id: 'VerifyOtpDto' });

export class VerifyOtpDto extends createZodDto(VerifyOtpSchema) {}
