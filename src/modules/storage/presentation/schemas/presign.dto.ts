import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';

export const PresignSchema = z
  .object({
    filename: z.string().min(1).meta({ description: 'Original file name' }),
    folder: z.string().min(1).meta({ description: 'Target folder in storage' }),
  })
  .meta({ id: 'PresignDto' });

export class PresignDto extends createZodDto(PresignSchema) {}
