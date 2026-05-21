import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';

export const UpdateTutorProfileSchema = z
  .object({
    bio: z
      .string()
      .min(1)
      .nullable()
      .optional()
      .meta({ example: 'Experienced math tutor...', description: 'Bio' }),
    specialization: z
      .string()
      .min(1)
      .nullable()
      .optional()
      .meta({ example: 'Mathematics', description: 'Specialization subject' }),
    experience: z
      .number()
      .int()
      .min(0)
      .nullable()
      .optional()
      .meta({ example: 5, description: 'Years of experience' }),
    education: z.string().min(1).nullable().optional().meta({
      example: 'Bachelor of Education',
      description: 'Educational background',
    }),
    pricePerHour: z
      .number()
      .positive()
      .nullable()
      .optional()
      .meta({ example: 150000, description: 'Price per hour in VND' }),
  })
  .meta({ id: 'UpdateTutorProfileDto' });

export class UpdateTutorProfileDto extends createZodDto(
  UpdateTutorProfileSchema,
) {}
