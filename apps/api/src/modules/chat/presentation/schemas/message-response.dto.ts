import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';
import { MessageResultData } from '../../application/queries/get-messages/get-messages.result';

export const MessageResponseSchema = z
  .object({
    id: z.string(),
    conversationId: z.string(),
    senderId: z.string().nullable(),
    content: z.string(),
    type: z.string(),
    fileUrl: z.string().nullable(),
    replyToId: z.string().nullable(),
    isDeleted: z.boolean(),
    createdAt: z.string().datetime(),
    sender: z
      .object({
        id: z.string(),
        nickname: z.string().nullable(),
        avatarUrl: z.string().nullable(),
      })
      .nullable(),
  })
  .meta({ id: 'MessageResponseDto' });

export class MessageResponseDto extends createZodDto(MessageResponseSchema) {
  static fromResult(result: MessageResultData): MessageResponseDto {
    const dto = new MessageResponseDto();
    dto.id = result.id;
    dto.conversationId = result.conversationId;
    dto.senderId = result.senderId;
    dto.content = result.content;
    dto.type = result.type;
    dto.fileUrl = result.fileUrl;
    dto.replyToId = result.replyToId;
    dto.isDeleted = result.isDeleted;
    dto.createdAt = result.createdAt.toISOString();
    dto.sender = result.sender;
    return dto;
  }
}
