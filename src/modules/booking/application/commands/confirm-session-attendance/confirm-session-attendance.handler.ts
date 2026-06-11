import { AttendanceStatus } from '../../../../../../generated/prisma/client';
import { ForbiddenException, NotFoundException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import { PrismaService } from '../../../../../shared/infrastructure/database/prisma/prisma.service';
import { IMessageBroker } from '../../../../../shared/application/interfaces/message-broker.interface';
import { EVENTS } from '../../../../../shared/application/constants/events.constants';
import {
  SessionStatus,
  BookingStatus,
} from '../../../../../shared/domain/enums/enums';
import { ConfirmSessionAttendanceResult } from './confirm-session-attendance.result';
import { ConfirmSessionAttendanceCommand } from './confirm-session-attendance.command';

@CommandHandler(ConfirmSessionAttendanceCommand)
export class ConfirmSessionAttendanceHandler
  implements
    ICommandHandler<ConfirmSessionAttendanceCommand>,
    ICommand<ConfirmSessionAttendanceCommand, ConfirmSessionAttendanceResult>
{
  constructor(
    private readonly prisma: PrismaService,
    @Inject(IMessageBroker) private readonly messageBroker: IMessageBroker,
  ) {}

  async execute(
    command: ConfirmSessionAttendanceCommand,
  ): Promise<ConfirmSessionAttendanceResult> {
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

    if (session.booking?.studentId !== command.studentId) {
      throw new ForbiddenException(
        'Only the assigned studentId can mark attendance for this session',
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
          status: AttendanceStatus.PRESENT,
          notes: command.notes,
        },
        update: {
          status: AttendanceStatus.PRESENT,
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

        const tutorId = session.booking?.tutorId;
        if (!tutorId) {
          throw new NotFoundException(
            `No tutor associated with session ${command.sessionId}`,
          );
        }
        const tutor = tutorId
          ? await tx.tutor.findUnique({
              where: { id: tutorId },
            })
          : null;
        const totalPrice =
          (tutor?.pricePerHour ?? 0) *
          ((session.endTime.getTime() - session.startTime.getTime()) /
            (1000 * 60 * 60));
        await tx.wallet.upsert({
          where: { tutorId },
          create: {
            tutorId,
            availableBalance: totalPrice,
            pendingBalance: 0,
          },
          update: {
            availableBalance: { increment: totalPrice },
          },
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

          await this.messageBroker.publishEvent(EVENTS.BOOKING_COMPLETED, {
            userId: session.booking!.studentId,
            tutorId: session.booking!.tutorId,
            bookingId: session.booking!.id,
          });
        }
      }

      return att;
    });

    return new ConfirmSessionAttendanceResult(
      attendance.id,
      attendance.sessionId,
      attendance.studentId,
      attendance.status as string,
      attendance.notes,
      attendance.createdAt.toISOString(),
    );
  }
}
