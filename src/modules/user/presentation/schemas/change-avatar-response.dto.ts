import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';

export const ChangeAvatarResultSchema = z
  .object({
    userId: z.string().meta({ example: '123', description: 'User Id' }),
    avatarUrl: z.string().url().meta({
      example: 'https://example.com/avatar.jpg',
      description: 'The secure URL of the new avatar',
    }),
  })
  .meta({ id: 'ChangeAvatarResultDto' });

export class ChangeAvatarResultDto extends createZodDto(
  ChangeAvatarResultSchema,
) {}
