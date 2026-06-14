import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';

export const CreateConversationSchema = z
  .object({
    targetUserId: z.string().meta({
      example: 'cuid12345',
      description: 'The ID of the user to start a conversation with',
    }),
  })
  .meta({ id: 'CreateConversationDto' });

export class CreateConversationDto extends createZodDto(
  CreateConversationSchema,
) {}

export const GetMessagesQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(50),
  })
  .meta({ id: 'GetMessagesQueryDto' });

export class GetMessagesQueryDto extends createZodDto(GetMessagesQuerySchema) {}

export const MarkReadSchema = z
  .object({
    lastMessageId: z.string().meta({
      example: 'cuid12345',
      description: 'The ID of the last message read',
    }),
  })
  .meta({ id: 'MarkReadDto' });

export class MarkReadDto extends createZodDto(MarkReadSchema) {}
