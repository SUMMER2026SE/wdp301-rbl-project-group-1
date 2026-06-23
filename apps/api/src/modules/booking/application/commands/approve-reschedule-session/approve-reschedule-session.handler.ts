import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionStatus } from '../../../../../shared/domain/enums/enums';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import { PrismaService } from '../../../../../shared/infrastructure/database/prisma/prisma.service';
import { ApproveRescheduleSessionCommand } from './approve-reschedule-session.command';
import { ApproveRescheduleSessionResult } from './approve-reschedule-session.result';

import { EventBus } from '@nestjs/cqrs';
import { SessionRescheduleApprovedEvent } from '../../../domain/events/booking-events';

@CommandHandler(ApproveRescheduleSessionCommand)
export class ApproveRescheduleSessionHandler
  implements
    ICommandHandler<ApproveRescheduleSessionCommand>,
    ICommand<ApproveRescheduleSessionCommand, ApproveRescheduleSessionResult>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(
    command: ApproveRescheduleSessionCommand,
  ): Promise<ApproveRescheduleSessionResult> {
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

    const canApproveReschedule =
      session.booking.studentId === command.userId ||
      session.booking.tutorId === command.userId;

    if (!canApproveReschedule) {
      throw new ForbiddenException(
        'Only the assigned student or tutor can approve a reschedule for this session',
      );
    }

    if (
      (session.status as SessionStatus) !== SessionStatus.RESCHEDULE_REQUESTED
    ) {
      throw new BadRequestException(
        'Session does not have a pending reschedule request',
      );
    }

    if (!session.proposedStartTime || !session.proposedEndTime) {
      throw new BadRequestException(
        'Session does not have proposed start and end times',
      );
    }

    if (session.rescheduleRequestedBy === command.userId) {
      throw new ForbiddenException(
        'You cannot approve your own reschedule request',
      );
    }

    const updatedSession = await this.prisma.session.update({
      where: { id: command.sessionId },
      data: {
        startTime: session.proposedStartTime,
        endTime: session.proposedEndTime,
        status: SessionStatus.SCHEDULED,
        proposedStartTime: null,
        proposedEndTime: null,
        proposedReason: null,
        rescheduleRequestedBy: null,
        isRescheduled: true,
      },
    });

    if (session.booking) {
      this.eventBus.publish(
        new SessionRescheduleApprovedEvent(
          updatedSession.id,
          session.booking.studentId,
          session.booking.tutorId,
          command.userId,
        ),
      );
    }

    return new ApproveRescheduleSessionResult(
      updatedSession.id,
      updatedSession.status as SessionStatus,
      updatedSession.startTime.toISOString(),
      updatedSession.endTime.toISOString(),
      updatedSession.proposedStartTime?.toISOString() ?? null,
      updatedSession.proposedEndTime?.toISOString() ?? null,
      updatedSession.proposedReason ?? null,
    );
  }
}
