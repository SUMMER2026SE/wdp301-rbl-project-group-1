import { createZodDto } from 'nestjs-zod';
import { z as zod } from 'zod';
import { BaseQuerySchema } from '../../../../shared/presentation/schemas/base-query.dto';

export const GetResourcesByTutorQuerySchema = BaseQuerySchema.meta({
  id: 'GetResourcesByTutorQueryDto',
});

export type GetResourcesByTutorQueryParams = zod.infer<
  typeof GetResourcesByTutorQuerySchema
>;

export class GetResourcesByTutorQueryDto extends createZodDto(
  GetResourcesByTutorQuerySchema,
) {}
