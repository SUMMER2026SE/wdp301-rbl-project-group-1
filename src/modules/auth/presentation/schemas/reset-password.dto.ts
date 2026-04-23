import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';

export const ResetPasswordSchema = z
  .object({
    newPassword: z.string().min(8).meta({
      example: 'NewPassword123',
      description: 'The new password for the user',
    }),
  })
  .meta({ id: 'ResetPasswordDto' });

export class ResetPasswordDto extends createZodDto(ResetPasswordSchema) {}
