import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';

export const EnrollCourseSchema = z
  .object({
    courseId: z.string().min(1).meta({ example: 'clhg12345000008l4f1h5g6i7' }),
  })
  .meta({ id: 'EnrollCourseDto' });

export class EnrollCourseDto extends createZodDto(EnrollCourseSchema) {}
