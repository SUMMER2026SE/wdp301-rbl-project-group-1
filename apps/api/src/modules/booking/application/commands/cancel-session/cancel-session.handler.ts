import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionStatus } from '../../../../../shared/domain/enums/enums';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import { PrismaService } from '../../../../../shared/infrastructure/database/prisma/prisma.service';
import { CancelSessionCommand } from './cancel-session.command';
import { CancelSessionResult } from './cancel-session.result';

const LATE_CANCELLATION_THRESHOLD_HOURS = 24;
const MILLISECONDS_PER_HOUR = 1000 * 60 * 60;

@CommandHandler(CancelSessionCommand)
export class CancelSessionHandler
  implements
    ICommandHandler<CancelSessionCommand>,
    ICommand<CancelSessionCommand, CancelSessionResult>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: CancelSessionCommand): Promise<CancelSessionResult> {
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

    const canCancel =
      session.booking.studentId === command.userId ||
      session.booking.tutorId === command.userId;

    if (!canCancel) {
      throw new ForbiddenException(
        'Only the assigned student or tutor can cancel this session',
      );
    }

    if ((session.status as SessionStatus) === SessionStatus.CANCELLED) {
      throw new BadRequestException('Session is already cancelled');
    }

    if ((session.status as SessionStatus) === SessionStatus.COMPLETED) {
      throw new BadRequestException('Completed sessions cannot be cancelled');
    }

    const cancelledAt = new Date();
    const hoursUntilStart =
      (session.startTime.getTime() - cancelledAt.getTime()) /
      MILLISECONDS_PER_HOUR;
    const isLateCancellation =
      hoursUntilStart < LATE_CANCELLATION_THRESHOLD_HOURS;
    const penaltyAmount = isLateCancellation
      ? this.calculateSessionPrice(
          session.booking.price,
          session.booking.totalSessions,
        )
      : 0;

    const updatedSession = await this.prisma.session.update({
      where: { id: command.sessionId },
      data: {
        status: SessionStatus.CANCELLED,
        notes: this.buildCancellationNotes(
          session.notes,
          command.reason,
          command.userId,
          cancelledAt,
        ),
      },
    });

    return new CancelSessionResult(
      updatedSession.id,
      updatedSession.status as SessionStatus,
      command.userId,
      command.reason,
      cancelledAt.toISOString(),
      updatedSession.startTime.toISOString(),
      Number(hoursUntilStart.toFixed(2)),
      isLateCancellation,
      penaltyAmount,
    );
  }

  private calculateSessionPrice(
    bookingPrice: number | null,
    totalSessions: number | null,
  ): number {
    if (!bookingPrice || !totalSessions || totalSessions <= 0) {
      return 0;
    }

    return Number((bookingPrice / totalSessions).toFixed(2));
  }

  private buildCancellationNotes(
    currentNotes: string | null,
    reason: string,
    cancelledByUserId: string,
    cancelledAt: Date,
  ): string {
    const cancellationNote = [
      `[CANCELLED_AT=${cancelledAt.toISOString()}]`,
      `[CANCELLED_BY=${cancelledByUserId}]`,
      reason,
    ].join(' ');

    return currentNotes
      ? `${currentNotes}\n${cancellationNote}`
      : cancellationNote;
  }
}
