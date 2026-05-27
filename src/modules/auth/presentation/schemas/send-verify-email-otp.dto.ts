import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';

export const SendVerifyEmailOtpSchema = z
  .object({
    email: z.string().email().meta({
      example: 'user@example.com',
      description: 'The email address of the user to verify',
    }),
  })
  .meta({ id: 'SendVerifyEmailOtpDto' });

export class SendVerifyEmailOtpDto extends createZodDto(
  SendVerifyEmailOtpSchema,
) {}
