import { createZodDto } from 'nestjs-zod';
import { z as zod } from 'zod';
import { z } from '../../infrastructure/documentation/zod/zod';

export const BaseQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val !== undefined ? parseInt(val, 10) : 1))
    .pipe(z.number().int().min(1))
    .meta({
      description: 'Page number (starts from 1)',
      example: '1',
    }),
  limit: z
    .string()
    .optional()
    .transform((val) => (val !== undefined ? parseInt(val, 10) : 10))
    .pipe(z.number().int().min(1).max(100))
    .meta({
      description: 'Number of items per page (1–100)',
      example: '10',
    }),
  search: z.string().optional().meta({
    description: 'Search keyword',
    example: '',
  }),
  sortBy: z.string().optional().meta({
    description: 'Field to sort by',
    example: 'createdAt',
  }),
  sortOrder: z.enum(['asc', 'desc']).optional().meta({
    description: 'Sort direction',
    example: 'desc',
  }),
});

export type BaseQueryParams = zod.infer<typeof BaseQuerySchema>;

export class BaseQueryDto extends createZodDto(
  BaseQuerySchema.meta({ id: 'BasePaginatedQueryDto' }),
) {}
