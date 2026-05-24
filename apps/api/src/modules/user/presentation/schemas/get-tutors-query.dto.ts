import { createZodDto } from 'nestjs-zod';
import { z as zod } from 'zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';
import { BaseQuerySchema } from '../../../../shared/presentation/schemas/base-query.dto';

export const GetTutorsQuerySchema = BaseQuerySchema.extend({
  specialization: z.string().optional().meta({
    description: 'Filter by tutor specialization',
    example: 'Mathematics',
  }),
  minPrice: z.coerce.number().min(0).optional().meta({
    description: 'Minimum price per hour',
    example: 0,
  }),
  maxPrice: z.coerce.number().min(0).optional().meta({
    description: 'Maximum price per hour',
    example: 2000000,
  }),
}).meta({ id: 'GetTutorsQueryDto' });

export type GetTutorsQueryParams = zod.infer<typeof GetTutorsQuerySchema>;

export class GetTutorsQueryDto extends createZodDto(GetTutorsQuerySchema) {}
