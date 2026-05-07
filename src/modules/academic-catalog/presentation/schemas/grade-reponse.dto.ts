import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';

export const GradeResponseSchema = z
  .object({
    id: z.string().meta({ example: 'cm9x8v7w60000abc123def456' }),
    name: z.string().meta({ example: 'Lớp 11' }),
    slug: z.string().meta({ example: 'lop-11' }),
    order: z.number().int().meta({ example: 11 }),
    createdAt: z
      .string()
      .datetime()
      .meta({ example: '2025-01-01T00:00:00.000Z' }),
  })
  .meta({ id: 'GradeResponseDto' });

export class GradeResponseDto extends createZodDto(GradeResponseSchema) {}
