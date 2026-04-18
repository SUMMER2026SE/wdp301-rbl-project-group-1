import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';

export const ChangeAvatarSchema = z
  .object({
    avatar: z.any().meta({
      type: 'string',
      format: 'binary',
      description: 'Avatar file (png, jpeg, webp)',
    }),
  })
  .meta({ id: 'ChangeAvatarDto' });

export class ChangeAvatarDto extends createZodDto(ChangeAvatarSchema) {}
