import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';

export const CreateSubjectSchema = z
  .object({
    name: z.string().min(1).max(100).meta({
      example: 'Mathematics',
      description: 'Name of the subject',
    }),
    slug: z.string().min(1).max(100).meta({
      example: 'mathematics',
      description: 'Slug of the subject',
    }),
  })
  .meta({ id: 'CreateSubjectDto' });

export class CreateSubjectDto extends createZodDto(CreateSubjectSchema) {}
