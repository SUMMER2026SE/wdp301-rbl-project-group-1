import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import { PrismaService } from '../../../../../shared/infrastructure/database/prisma/prisma.service';
import { DisputeStatus } from '../../../../../shared/domain/enums/enums';
import { ResolveDisputeCommand } from './resolve-dispute.command';
import { ResolveDisputeResult } from './resolve-dispute.result';

@CommandHandler(ResolveDisputeCommand)
export class ResolveDisputeHandler
  implements
    ICommandHandler<ResolveDisputeCommand>,
    ICommand<ResolveDisputeCommand, ResolveDisputeResult>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: ResolveDisputeCommand): Promise<ResolveDisputeResult> {
    const ticket = await this.prisma.disputeTicket.findUnique({
      where: { id: command.ticketId },
    });

    if (!ticket) {
      throw new NotFoundException(
        `Dispute ticket with ID ${command.ticketId} not found`,
      );
    }

    if (
      ticket.status === (DisputeStatus.RESOLVED_REFUNDED as string) ||
      ticket.status === (DisputeStatus.RESOLVED_REJECTED as string)
    ) {
      throw new BadRequestException(
        'This dispute ticket has already been resolved',
      );
    }

    const newStatus =
      command.resolution === 'REFUND'
        ? DisputeStatus.RESOLVED_REFUNDED
        : DisputeStatus.RESOLVED_REJECTED;

    const updated = await this.prisma.disputeTicket.update({
      where: { id: command.ticketId },
      data: { status: newStatus },
    });

    return new ResolveDisputeResult(
      updated.id,
      updated.bookingId,
      updated.sessionId,
      updated.reporterId,
      updated.targetId,
      updated.reason,
      updated.status as DisputeStatus,
      updated.createdAt.toISOString(),
      updated.updatedAt.toISOString(),
    );
  }
}
