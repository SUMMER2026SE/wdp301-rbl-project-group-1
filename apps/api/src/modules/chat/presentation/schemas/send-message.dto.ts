import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';
import { MessageType } from '../../../../shared/domain/enums/enums';

export const SendMessageSchema = z
  .object({
    conversationId: z.string().meta({
      example: 'cuid12345',
      description: 'The ID of the conversation',
    }),
    content: z.string().min(1).meta({
      example: 'Hello there!',
      description: 'The content of the message',
    }),
    type: z.nativeEnum(MessageType).optional().default(MessageType.TEXT).meta({
      example: MessageType.TEXT,
      description: 'The type of the message',
    }),
    fileUrl: z.string().url().optional().meta({
      example: 'https://example.com/file.jpg',
      description: 'The URL of the file (if applicable)',
    }),
    replyToId: z.string().optional().meta({
      example: 'cuid67890',
      description: 'The ID of the message being replied to',
    }),
  })
  .meta({ id: 'SendMessageDto' });

export class SendMessageDto extends createZodDto(SendMessageSchema) {}
