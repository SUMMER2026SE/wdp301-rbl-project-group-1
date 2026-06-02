import { AttendanceStatus } from '../../../../../../generated/prisma/client';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import { PrismaService } from '../../../../../shared/infrastructure/database/prisma/prisma.service';
import {
  SessionStatus,
  BookingStatus,
} from '../../../../../shared/domain/enums/enums';
import { MarkSessionAttendanceCommand } from './mark-session-attendance.command';
import { MarkSessionAttendanceResult } from './mark-session-attendance.result';

@CommandHandler(MarkSessionAttendanceCommand)
export class MarkSessionAttendanceHandler
  implements
    ICommandHandler<MarkSessionAttendanceCommand>,
    ICommand<MarkSessionAttendanceCommand, MarkSessionAttendanceResult>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    command: MarkSessionAttendanceCommand,
  ): Promise<MarkSessionAttendanceResult> {
    const session = await this.prisma.session.findUnique({
      where: { id: command.sessionId },
      include: {
        booking: true,
      },
    });

    if (!session) {
      throw new NotFoundException(
        `Session with ID ${command.sessionId} not found`,
      );
    }

    if (session.booking?.tutorId !== command.tutorId) {
      throw new ForbiddenException(
        'Only the assigned tutor can mark attendance for this session',
      );
    }

    // Upsert the attendance record
    const attendance = await this.prisma.$transaction(async (tx) => {
      const att = await tx.sessionAttendance.upsert({
        where: {
          sessionId_studentId: {
            sessionId: command.sessionId,
            studentId: command.studentId,
          },
        },
        create: {
          sessionId: command.sessionId,
          studentId: command.studentId,
          status: command.status as AttendanceStatus,
          notes: command.notes,
        },
        update: {
          status: command.status as AttendanceStatus,
          notes: command.notes,
        },
      });

      // Update session status to COMPLETED if not already
      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
      if (session.status !== SessionStatus.COMPLETED) {
        await tx.session.update({
          where: { id: session.id },
          data: { status: SessionStatus.COMPLETED },
        });
      }

      // Check if all sessions in this booking are completed
      if (session.bookingId) {
        const remainingSessions = await tx.session.count({
          where: {
            bookingId: session.bookingId,
            status: { not: SessionStatus.COMPLETED },
          },
        });

        // If no remaining sessions, and booking isn't already COMPLETED
        if (
          remainingSessions === 0 &&
          session.booking?.status !== (BookingStatus.COMPLETED as string)
        ) {
          await tx.booking.update({
            where: { id: session.bookingId },
            data: { status: BookingStatus.COMPLETED },
          });
        }
      }

      return att;
    });

    return new MarkSessionAttendanceResult(
      attendance.id,
      attendance.sessionId,
      attendance.studentId,
      attendance.status as string,
      attendance.notes,
      attendance.createdAt.toISOString(),
    );
  }
}
