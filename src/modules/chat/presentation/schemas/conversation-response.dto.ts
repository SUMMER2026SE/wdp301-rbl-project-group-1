import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';
import { CreateConversationResult } from '../../application/commands/create-conversation/create-conversation.result';
import { ConversationResultData } from '../../application/queries/get-conversations/get-conversations.result';

// --- Create Conversation ---

export const CreateConversationResponseSchema = z
  .object({
    id: z.string(),
    type: z.string(),
    name: z.string().nullable(),
    createdAt: z.string().datetime(),
  })
  .meta({ id: 'CreateConversationResponseDto' });

export class CreateConversationResponseDto extends createZodDto(
  CreateConversationResponseSchema,
) {
  static fromResult(
    result: CreateConversationResult,
  ): CreateConversationResponseDto {
    const dto = new CreateConversationResponseDto();
    dto.id = result.id;
    dto.type = result.type;
    dto.name = result.name;
    dto.createdAt = result.createdAt;
    return dto;
  }
}

// --- Conversation List Item ---

const ParticipantSchema = z.object({
  userId: z.string(),
  nickname: z.string().nullable(),
  avatarUrl: z.string().nullable(),
});

const LastMessageSchema = z
  .object({
    id: z.string(),
    content: z.string(),
    senderId: z.string().nullable(),
    createdAt: z.string().datetime(),
  })
  .nullable();

export const ConversationResponseSchema = z
  .object({
    id: z.string(),
    type: z.string(),
    name: z.string().nullable(),
    avatarUrl: z.string().nullable(),
    updatedAt: z.string().datetime(),
    lastMessage: LastMessageSchema,
    unreadCount: z.number().int(),
    participants: z.array(ParticipantSchema),
  })
  .meta({ id: 'ConversationResponseDto' });

export class ConversationResponseDto extends createZodDto(
  ConversationResponseSchema,
) {
  static fromResult(result: ConversationResultData): ConversationResponseDto {
    const dto = new ConversationResponseDto();
    dto.id = result.id;
    dto.type = result.type;
    dto.name = result.name;
    dto.avatarUrl = result.avatarUrl;
    dto.updatedAt = result.updatedAt.toISOString();
    dto.lastMessage = result.lastMessage
      ? {
          ...result.lastMessage,
          createdAt: result.lastMessage.createdAt.toISOString(),
        }
      : null;
    dto.unreadCount = result.unreadCount;
    dto.participants = result.participants;
    return dto;
  }
}
