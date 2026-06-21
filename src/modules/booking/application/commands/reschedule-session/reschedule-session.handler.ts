import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionStatus } from '../../../../../shared/domain/enums/enums';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import { PrismaService } from '../../../../../shared/infrastructure/database/prisma/prisma.service';
import { RescheduleSessionCommand } from './reschedule-session.command';
import { RescheduleSessionResult } from './reschedule-session.result';

import { EventBus } from '@nestjs/cqrs';
import { SessionRescheduleRequestedEvent } from '../../../domain/events/booking-events';

@CommandHandler(RescheduleSessionCommand)
export class RescheduleSessionHandler
  implements
    ICommandHandler<RescheduleSessionCommand>,
    ICommand<RescheduleSessionCommand, RescheduleSessionResult>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(
    command: RescheduleSessionCommand,
  ): Promise<RescheduleSessionResult> {
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

    const canRequestReschedule =
      session.booking.studentId === command.userId ||
      session.booking.tutorId === command.userId;

    if (!canRequestReschedule) {
      throw new ForbiddenException(
        'Only the assigned student or tutor can request a reschedule for this session',
      );
    }

    const updatedSession = await this.prisma.session.update({
      where: { id: command.sessionId },
      data: {
        status: SessionStatus.RESCHEDULE_REQUESTED,
        proposedStartTime: new Date(command.proposedStartTime),
        proposedEndTime: new Date(command.proposedEndTime),
        proposedReason: command.proposedReason,
        rescheduleRequestedBy: command.userId,
      },
    });

    const proposedStartTimeStr =
      updatedSession.proposedStartTime instanceof Date
        ? updatedSession.proposedStartTime.toISOString()
        : null;
    const proposedEndTimeStr =
      updatedSession.proposedEndTime instanceof Date
        ? updatedSession.proposedEndTime.toISOString()
        : null;

    if (proposedStartTimeStr && session.booking) {
      this.eventBus.publish(
        new SessionRescheduleRequestedEvent(
          updatedSession.id,
          session.booking.studentId,
          session.booking.tutorId,
          command.userId,
          proposedStartTimeStr,
        ),
      );
    }

    return new RescheduleSessionResult(
      updatedSession.id,
      updatedSession.status as SessionStatus,
      proposedStartTimeStr,
      proposedEndTimeStr,
      updatedSession.proposedReason ?? null,
    );
  }
}
