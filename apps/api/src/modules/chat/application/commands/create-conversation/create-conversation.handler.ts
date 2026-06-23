import { ConflictException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '../../../../../shared/infrastructure/database/prisma/prisma.service';
import {
  ConversationType,
  ParticipantRole,
} from '../../../../../shared/domain/enums/enums';
import { CreateConversationCommand } from './create-conversation.command';
import { CreateConversationResult } from './create-conversation.result';

@CommandHandler(CreateConversationCommand)
export class CreateConversationHandler implements ICommandHandler<CreateConversationCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    command: CreateConversationCommand,
  ): Promise<CreateConversationResult> {
    const { initiatorId, targetUserId } = command;

    // Validate target user exists
    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, nickname: true },
    });
    if (!targetUser) {
      throw new NotFoundException(`User ${targetUserId} not found`);
    }

    // Check if DIRECT conversation already exists between the two users
    const existing = await this.prisma.conversation.findFirst({
      where: {
        type: ConversationType.DIRECT,
        AND: [
          { participants: { some: { userId: initiatorId } } },
          { participants: { some: { userId: targetUserId } } },
        ],
      },
    });

    if (existing) {
      throw new ConflictException(
        `A direct conversation already exists between these users (id: ${existing.id})`,
      );
    }

    const conversation = await this.prisma.conversation.create({
      data: {
        type: ConversationType.DIRECT,
        participants: {
          create: [
            { userId: initiatorId, role: ParticipantRole.MEMBER },
            { userId: targetUserId, role: ParticipantRole.MEMBER },
          ],
        },
      },
    });

    return new CreateConversationResult(
      conversation.id,
      conversation.type,
      conversation.name,
      conversation.createdAt.toISOString(),
    );
  }
}
