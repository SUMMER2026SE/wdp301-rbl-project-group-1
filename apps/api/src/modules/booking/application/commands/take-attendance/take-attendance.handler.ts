import {
  AttendanceStatus,
  SessionStatus,
} from '../../../../../../generated/prisma/client';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import { PrismaService } from '../../../../../shared/infrastructure/database/prisma/prisma.service';
import { TakeAttendanceCommand } from './take-attendance.command';
import { TakeAttendanceResult } from './take-attendance.result';

@CommandHandler(TakeAttendanceCommand)
export class TakeAttendanceHandler
  implements
    ICommandHandler<TakeAttendanceCommand>,
    ICommand<TakeAttendanceCommand, TakeAttendanceResult>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: TakeAttendanceCommand): Promise<TakeAttendanceResult> {
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

    if (session.booking.tutorId !== command.tutorId) {
      throw new ForbiddenException(
        'Only the assigned tutor can take attendance for this session',
      );
    }

    const studentId = session.booking.studentId;

    const result = await this.prisma.$transaction(async (tx) => {
      // Upsert the attendance record for the student in this session
      const attendance = await tx.sessionAttendance.upsert({
        where: {
          sessionId_studentId: {
            sessionId: command.sessionId,
            studentId,
          },
        },
        create: {
          sessionId: command.sessionId,
          studentId,
          status: command.status as AttendanceStatus,
          notes: command.notes,
        },
        update: {
          status: command.status as AttendanceStatus,
          notes: command.notes,
        },
      });

      // Transition session status to AWAITING_CONFIRMATION
      await tx.session.update({
        where: { id: command.sessionId },
        data: { status: SessionStatus.AWAITING_CONFIRMATION },
      });

      return attendance;
    });

    return new TakeAttendanceResult(
      result.id,
      result.sessionId,
      result.studentId,
      result.status as string,
      result.notes,
      SessionStatus.AWAITING_CONFIRMATION,
      result.createdAt.toISOString(),
    );
  }
}
