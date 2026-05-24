import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';

export const TutorResponseSchema = z
  .object({
    id: z.string().meta({ example: 'cm9x8v7w60000abc123def456' }),
    nickname: z.string().nullable().meta({ example: 'tutor_jane' }),
    avatarUrl: z
      .string()
      .url()
      .nullable()
      .meta({ example: 'https://example.com/avatar.jpg' }),
    bio: z.string().nullable().meta({ example: 'Experienced math tutor' }),
    specialization: z.string().nullable().meta({ example: 'Mathematics' }),
    experience: z.number().int().nullable().meta({ example: 5 }),
    education: z.string().nullable().meta({ example: 'M.Sc. Mathematics' }),
    pricePerHour: z.number().nullable().meta({ example: 150000 }),
    rating: z.number().meta({ example: 4.8 }),
    reviewCount: z.number().int().meta({ example: 42 }),
    studentCount: z.number().int().meta({ example: 100 }),
  })
  .meta({ id: 'TutorResponseDto' });

export class TutorResponseDto extends createZodDto(TutorResponseSchema) {}
