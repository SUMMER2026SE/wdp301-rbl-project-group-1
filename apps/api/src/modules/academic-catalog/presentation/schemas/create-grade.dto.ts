import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';

export const CreateGradeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  order: z
    .number()
    .int('Order must be an integer')
    .min(0, 'Order must be >= 0'),
});

export class CreateGradeDto extends createZodDto(CreateGradeSchema) {}
