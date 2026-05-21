import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';

export const GetResourcesByTargetQuerySchema = z
  .object({
    targetType: z.enum(['COURSE', 'LESSON']).meta({
      description: 'Type of the target entity',
      example: 'COURSE',
    }),
  })
  .meta({ id: 'GetResourcesByTargetQueryDto' });

export class GetResourcesByTargetQueryDto extends createZodDto(
  GetResourcesByTargetQuerySchema,
) {}
