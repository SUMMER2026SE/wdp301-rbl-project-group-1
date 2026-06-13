import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '../../../../../shared/infrastructure/database/prisma/prisma.service';
import { MarkReadCommand } from './mark-read.command';

@CommandHandler(MarkReadCommand)
export class MarkReadHandler implements ICommandHandler<MarkReadCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: MarkReadCommand): Promise<void> {
    const { userId, conversationId, lastMessageId } = command;

    // Verify user is a participant
    const participant = await this.prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
    });

    if (!participant) {
      throw new ForbiddenException(
        'You are not a participant of this conversation',
      );
    }

    // Verify message belongs to this conversation
    const message = await this.prisma.message.findFirst({
      where: { id: lastMessageId, conversationId },
    });

    if (!message) {
      throw new NotFoundException('Message not found in this conversation');
    }

    await this.prisma.conversationParticipant.update({
      where: { conversationId_userId: { conversationId, userId } },
      data: { lastReadMessageId: lastMessageId },
    });
  }
}
