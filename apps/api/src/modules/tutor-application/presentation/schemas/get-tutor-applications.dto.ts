import { createZodDto } from 'nestjs-zod';
import { z as zod } from 'zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';
import { BaseQuerySchema } from '../../../../shared/presentation/schemas/base-query.dto';

export const GetTutorApplicationsQuerySchema = BaseQuerySchema.extend({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional().meta({
    description: 'Filter by tutor application status',
    example: 'PENDING',
  }),
}).meta({ id: 'GetTutorApplicationsQueryDto' });

export type GetTutorApplicationsQueryParams = zod.infer<
  typeof GetTutorApplicationsQuerySchema
>;

export class GetTutorApplicationsDto extends createZodDto(
  GetTutorApplicationsQuerySchema,
) {}
