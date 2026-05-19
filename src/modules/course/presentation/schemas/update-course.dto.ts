import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';

const CourseLevelEnum = z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']);

export const UpdateCourseSchema = z
  .object({
    title: z.string().min(1).optional().meta({
      example: 'Introduction to NestJS',
      description: 'The title of the course',
    }),
    description: z.string().nullable().optional().meta({
      example: 'Learn the basics of NestJS framework',
      description: 'The description of the course',
    }),
    price: z.number().min(0).nullable().optional().meta({
      example: 49.99,
      description: 'The price of the course',
    }),
    subjectId: z.string().min(1).optional().meta({
      example: 'clhg12345000008l4f1h5g6i7',
      description: 'The ID of the subject',
    }),
    gradeId: z.string().min(1).optional().meta({
      example: 'clhg12345000008l4f1h5g6i8',
      description: 'The ID of the grade',
    }),
    level: CourseLevelEnum.optional().meta({
      example: 'BEGINNER',
      description: 'The difficulty level of the course',
    }),
  })
  .meta({ id: 'UpdateCourseDto' });

export class UpdateCourseDto extends createZodDto(UpdateCourseSchema) {}
