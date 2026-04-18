import { createZodDto } from 'nestjs-zod';
import { UserRole } from '../../../../shared/domain/enums/enums';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';

export const RegisterSchema = z
  .object({
    email: z.string().email().meta({
      example: 'user@example.com',
      description: 'The email of the user',
    }),
    password: z.string().min(8).meta({
      example: 'password123',
      description: 'The password of the user',
    }),
    role: z.nativeEnum(UserRole).meta({
      example: UserRole.STUDENT,
      description: 'The role of the user',
    }),
    nickname: z.string().min(1).meta({
      example: 'Tu VN',
      description: 'The nickname of the user',
    }),
    phone: z.string().min(1).meta({
      example: '+1234567890',
      description: 'Phone number',
    }),
    dateOfBirth: z.string().date().meta({
      example: '1990-01-01',
      description: 'Date of birth',
    }),
  })
  .meta({ id: 'RegisterDto' });

export class RegisterDto extends createZodDto(RegisterSchema) {}
