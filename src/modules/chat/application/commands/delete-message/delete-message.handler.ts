import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '../../../../../shared/infrastructure/database/prisma/prisma.service';
import { DeleteMessageCommand } from './delete-message.command';

@CommandHandler(DeleteMessageCommand)
export class DeleteMessageHandler implements ICommandHandler<DeleteMessageCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: DeleteMessageCommand): Promise<void> {
    const { messageId, requesterId } = command;

    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message || message.isDeleted) {
      throw new NotFoundException('Message not found');
    }

    if (message.senderId !== requesterId) {
      throw new ForbiddenException('You can only delete your own messages');
    }

    await this.prisma.message.update({
      where: { id: messageId },
      data: { isDeleted: true },
    });
  }
}
