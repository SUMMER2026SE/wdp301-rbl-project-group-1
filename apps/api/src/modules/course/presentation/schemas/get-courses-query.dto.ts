import { createZodDto } from 'nestjs-zod';
import { CourseStatus } from 'src/shared/domain/enums/enums';
import { z as zod } from 'zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';
import { BaseQuerySchema } from '../../../../shared/presentation/schemas/base-query.dto';

export const GetCoursesQuerySchema = BaseQuerySchema.extend({
  gradeId: z.string().optional().meta({
    description: 'Filter by grade ID',
    example: 'cm9x8v7w60000abc123def456',
  }),
  subjectId: z.string().optional().meta({
    description: 'Filter by subject ID',
    example: 'cm9x8v7w60000abc123def456',
  }),
  status: z.enum(Object.values(CourseStatus)).optional().meta({
    description: 'Filter by course status',
    example: 'ONGOING',
  }),
}).meta({ id: 'GetCoursesQueryDto' });

export type GetCoursesQueryParams = zod.infer<typeof GetCoursesQuerySchema>;

export class GetCoursesQueryDto extends createZodDto(GetCoursesQuerySchema) {}
