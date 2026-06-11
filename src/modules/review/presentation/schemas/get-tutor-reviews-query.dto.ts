import { createZodDto } from 'nestjs-zod';
import { z as zod } from 'zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';
import { BaseQuerySchema } from '../../../../shared/presentation/schemas/base-query.dto';

export const GetTutorReviewsQuerySchema = BaseQuerySchema.extend({
  sortBy: z.enum(['createdAt', 'rating']).optional().meta({
    description: 'Field to sort by',
    example: 'createdAt',
  }),
}).meta({ id: 'GetTutorReviewsQueryDto' });

export type GetTutorReviewsQueryParams = zod.infer<
  typeof GetTutorReviewsQuerySchema
>;

export class GetTutorReviewsQueryDto extends createZodDto(
  GetTutorReviewsQuerySchema,
) {}
