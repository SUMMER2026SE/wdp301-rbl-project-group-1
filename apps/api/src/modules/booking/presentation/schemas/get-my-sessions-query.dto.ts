import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';

export const GetMySessionsQuerySchema = z.object({
  startDate: z.string().datetime().optional().meta({
    description: 'Filter sessions starting from this date',
  }),
  endDate: z.string().datetime().optional().meta({
    description: 'Filter sessions ending before this date',
  }),
});

export class GetMySessionsQueryDto extends createZodDto(
  GetMySessionsQuerySchema,
) {}
