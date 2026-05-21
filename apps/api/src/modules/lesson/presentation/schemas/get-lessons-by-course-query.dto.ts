import { createZodDto } from 'nestjs-zod';
import { z as zod } from 'zod';
import { BaseQuerySchema } from '../../../../shared/presentation/schemas/base-query.dto';

export const GetLessonsByCourseQuerySchema = BaseQuerySchema.meta({
  id: 'GetLessonsByCourseQueryDto',
});

export type GetLessonsByCourseQueryParams = zod.infer<
  typeof GetLessonsByCourseQuerySchema
>;

export class GetLessonsByCourseQueryDto extends createZodDto(
  GetLessonsByCourseQuerySchema,
) {}
