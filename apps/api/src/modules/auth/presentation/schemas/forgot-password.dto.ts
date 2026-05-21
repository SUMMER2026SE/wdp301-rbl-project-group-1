import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';

export const ForgotPasswordSchema = z
  .object({
    email: z.string().email().meta({
      example: 'user@example.com',
      description: 'The email address of the user',
    }),
  })
  .meta({ id: 'ForgotPasswordDto' });

export class ForgotPasswordDto extends createZodDto(ForgotPasswordSchema) {}
