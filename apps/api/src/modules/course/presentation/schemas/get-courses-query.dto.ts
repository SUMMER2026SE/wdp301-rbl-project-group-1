import { createZodDto } from 'nestjs-zod';
import { CourseStatus } from 'src/shared/domain/enums/enums';
import { z as zod } from 'zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';
import { BaseQuerySchema } from '../../../../shared/presentation/schemas/base-query.dto';

export const GetCoursesQuerySchema = BaseQuerySchema.extend({
  gradeIds: z
    .union([z.string(), z.array(z.string())])
    .transform((val) => (Array.isArray(val) ? val : [val]))
    .optional()
    .meta({
      description: 'Filter by grade IDs',
      example: ['cm9x8v7w60000abc123def456'],
    }),
  subjectIds: z
    .union([z.string(), z.array(z.string())])
    .transform((val) => (Array.isArray(val) ? val : [val]))
    .optional()
    .meta({
      description: 'Filter by subject IDs',
      example: ['cm9x8v7w60000abc123def456'],
    }),
  status: z.nativeEnum(CourseStatus).optional().meta({
    description: 'Filter by course status',
    example: 'ONGOING',
  }),
  minPrice: z.coerce.number().min(0).optional().meta({
    description: 'Minimum price filter',
    example: 0,
  }),
  maxPrice: z.coerce.number().min(0).optional().meta({
    description: 'Maximum price filter',
    example: 2000000,
  }),
}).meta({ id: 'GetCoursesQueryDto' });

export type GetCoursesQueryParams = zod.infer<typeof GetCoursesQuerySchema>;

export class GetCoursesQueryDto extends createZodDto(GetCoursesQuerySchema) {}
