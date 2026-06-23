import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import { PrismaService } from '../../../../../shared/infrastructure/database/prisma/prisma.service';
import { SendDisputeMessageCommand } from './send-dispute-message.command';
import { SendDisputeMessageResult } from './send-dispute-message.result';

@CommandHandler(SendDisputeMessageCommand)
export class SendDisputeMessageHandler
  implements
    ICommandHandler<SendDisputeMessageCommand>,
    ICommand<SendDisputeMessageCommand, SendDisputeMessageResult>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    command: SendDisputeMessageCommand,
  ): Promise<SendDisputeMessageResult> {
    const ticket = await this.prisma.disputeTicket.findUnique({
      where: { id: command.ticketId },
    });

    if (!ticket) {
      throw new NotFoundException(
        `Dispute ticket with ID ${command.ticketId} not found`,
      );
    }

    // Admins can message in any ticket. Students/tutors must be either the reporter or the target.
    if (command.role !== 'ADMIN') {
      if (
        ticket.reporterId !== command.senderId &&
        ticket.targetId !== command.senderId
      ) {
        throw new ForbiddenException(
          'You do not have permission to post messages to this dispute ticket',
        );
      }
    }

    const message = await this.prisma.disputeMessage.create({
      data: {
        ticketId: command.ticketId,
        senderId: command.senderId,
        content: command.content,
      },
    });

    return new SendDisputeMessageResult(
      message.id,
      message.ticketId,
      message.senderId,
      message.content,
      message.createdAt.toISOString(),
    );
  }
}
