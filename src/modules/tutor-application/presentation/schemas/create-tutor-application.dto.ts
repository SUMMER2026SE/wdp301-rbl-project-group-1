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
    phone: z.string().min(1).meta({
      example: '0901234567',
      description: 'Tutor phone number',
    }),
    address: z.string().optional().meta({
      example: '123 Nguyen Hue, Ho Chi Minh',
      description: 'Tutor address',
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
    subjectIds: z
      .array(z.string())
      .min(1)
      .meta({
        example: ['cuid-subject-1', 'cuid-subject-2'],
        description: 'List of subject IDs the tutor can teach',
      }),
    gradeIds: z
      .array(z.string())
      .min(1)
      .meta({
        example: ['cuid-grade-1', 'cuid-grade-2'],
        description: 'List of grade IDs the tutor can teach',
      }),
    avatarUrl: z.string().url().optional().meta({
      example:
        'https://res.cloudinary.com/edura/image/upload/v1234567890/avatar.jpg',
      description: 'Tutor avatar URL',
    }),
    files: z
      .array(z.string())
      .optional()
      .meta({
        example: ['app-files/certificates/cert.pdf'],
        description: 'List of file paths stored in Supabase',
      }),
  })
  .meta({ id: 'CreateTutorApplicationDto' });

export class CreateTutorApplicationDto extends createZodDto(
  CreateTutorApplicationSchema,
) {}
