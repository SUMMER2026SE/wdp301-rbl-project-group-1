import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';

export const LoginSchema = z
  .object({
    email: z.string().email().meta({
      example: 'user@example.com',
      description: 'The email of the user',
    }),
    password: z.string().min(8).meta({
      example: 'password123',
      description: 'The password of the user',
    }),
  })
  .meta({ id: 'LoginDto' });

export class LoginDto extends createZodDto(LoginSchema) {}
