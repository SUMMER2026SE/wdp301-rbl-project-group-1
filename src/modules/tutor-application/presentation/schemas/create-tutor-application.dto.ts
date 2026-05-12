import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';

export const CreateTutorApplicationSchema = z
  .object({
    email: z.string().email().meta({
      example: 'teacher@edura.edu.vn',
      description: 'Applicant email address',
    }),
    specialization: z.string().min(1).meta({
      example: 'Mathematics',
      description: 'Tutor main specialization',
    }),
    bio: z.string().optional().meta({
      example: 'I have 5 years of teaching experience',
      description: 'Tutor introduction',
    }),
    experience: z.number().int().min(0).optional().meta({
      example: 5,
      description: 'Years of teaching experience',
    }),
    education: z.string().optional().meta({
      example: 'B.Sc. in Mathematics',
      description: 'Tutor educational background',
    }),
    pricePerHour: z.number().min(0).optional().meta({
      example: 250000,
      description: 'Expected tutoring price per hour',
    }),
  })
  .meta({ id: 'CreateTutorApplicationDto' });

export class CreateTutorApplicationDto extends createZodDto(
  CreateTutorApplicationSchema,
) {}
