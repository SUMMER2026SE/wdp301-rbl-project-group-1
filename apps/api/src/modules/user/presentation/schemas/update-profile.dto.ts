import { createZodDto } from 'nestjs-zod';
import { Gender } from 'src/shared/domain/enums/enums';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';

export const UpdateProfileSchema = z
  .object({
    nickname: z
      .string()
      .min(1)
      .optional()
      .meta({ example: 'johndoe', description: 'Nickname' }),
    avatarUrl: z.string().url().optional().meta({
      example: 'https://example.com/avatar.jpg',
      description: 'Avatar URL',
    }),
    phone: z
      .string()
      .min(1)
      .optional()
      .meta({ example: '+1234567890', description: 'Phone number' }),
    dateOfBirth: z
      .string()
      .date()
      .optional()
      .meta({ example: '1990-01-01', description: 'Date of birth' }),
    gender: z
      .nativeEnum(Gender)
      .optional()
      .meta({ example: Gender.MALE, description: 'Gender' }),
    address: z
      .string()
      .min(1)
      .optional()
      .meta({ example: '123 Main St', description: 'Address' }),
  })
  .meta({ id: 'UpdateProfileDto' });

export class UpdateProfileDto extends createZodDto(UpdateProfileSchema) {}
