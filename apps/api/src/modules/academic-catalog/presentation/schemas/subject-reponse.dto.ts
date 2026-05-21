import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';

export const SubjectResponseSchema = z
  .object({
    id: z.string().meta({ example: 'cm9x8v7w60000abc123def456' }),
    name: z.string().meta({ example: 'Toán' }),
    slug: z.string().meta({ example: 'toan' }),
    createdAt: z
      .string()
      .datetime()
      .meta({ example: '2025-01-01T00:00:00.000Z' }),
  })
  .meta({ id: 'SubjectResponseDto' });

export class SubjectResponseDto extends createZodDto(SubjectResponseSchema) {}
