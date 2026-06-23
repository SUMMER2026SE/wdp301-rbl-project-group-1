import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionStatus } from '../../../../../shared/domain/enums/enums';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import { PrismaService } from '../../../../../shared/infrastructure/database/prisma/prisma.service';
import { RejectRescheduleSessionCommand } from './reject-reschedule-session.command';
import { RejectRescheduleSessionResult } from './reject-reschedule-session.result';
import { EventBus } from '@nestjs/cqrs';
import { SessionRescheduleRejectedEvent } from '../../../domain/events/booking-events';

@CommandHandler(RejectRescheduleSessionCommand)
export class RejectRescheduleSessionHandler
  implements
    ICommandHandler<RejectRescheduleSessionCommand>,
    ICommand<RejectRescheduleSessionCommand, RejectRescheduleSessionResult>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(
    command: RejectRescheduleSessionCommand,
  ): Promise<RejectRescheduleSessionResult> {
    const session = await this.prisma.session.findUnique({
      where: { id: command.sessionId },
      include: { booking: true },
    });

    if (!session) {
      throw new NotFoundException(
        `Session with ID ${command.sessionId} not found`,
      );
    }

    if (!session.booking) {
      throw new NotFoundException(
        `No booking associated with session ${command.sessionId}`,
      );
    }

    const canRejectReschedule =
      session.booking.studentId === command.userId ||
      session.booking.tutorId === command.userId;

    if (!canRejectReschedule) {
      throw new ForbiddenException(
        'Only the assigned student or tutor can reject a reschedule for this session',
      );
    }

    if (
      (session.status as SessionStatus) !== SessionStatus.RESCHEDULE_REQUESTED
    ) {
      throw new BadRequestException(
        'Session does not have a pending reschedule request',
      );
    }

    if (session.rescheduleRequestedBy === command.userId) {
      // The person who requested it can also cancel it, but for the scope of "reject" let's allow it to be cancelled by the requester or rejected by the other party.
      // Wait, if we want to allow the requester to cancel their own request, we shouldn't throw here.
      // We will allow both parties to revert it.
    }

    const updatedSession = await this.prisma.session.update({
      where: { id: command.sessionId },
      data: {
        status: SessionStatus.SCHEDULED,
        proposedStartTime: null,
        proposedEndTime: null,
        proposedReason: null,
        rescheduleRequestedBy: null,
      },
    });

    if (session.booking) {
      this.eventBus.publish(
        new SessionRescheduleRejectedEvent(
          updatedSession.id,
          session.booking.studentId,
          session.booking.tutorId,
          command.userId,
        ),
      );
    }

    return new RejectRescheduleSessionResult(
      updatedSession.id,
      updatedSession.status as SessionStatus,
    );
  }
}
