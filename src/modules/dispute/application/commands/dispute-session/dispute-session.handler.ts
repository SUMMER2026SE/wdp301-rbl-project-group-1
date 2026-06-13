import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import { PrismaService } from '../../../../../shared/infrastructure/database/prisma/prisma.service';
import { DisputeStatus } from '../../../../../shared/domain/enums/enums';
import { DisputeSessionCommand } from './dispute-session.command';
import { DisputeSessionResult } from './dispute-session.result';

@CommandHandler(DisputeSessionCommand)
export class DisputeSessionHandler
  implements
    ICommandHandler<DisputeSessionCommand>,
    ICommand<DisputeSessionCommand, DisputeSessionResult>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: DisputeSessionCommand): Promise<DisputeSessionResult> {
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

    if (!session.booking) {
      throw new BadRequestException(
        `Session with ID ${command.sessionId} is not associated with any booking`,
      );
    }

    if (session.booking.studentId !== command.studentId) {
      throw new ForbiddenException(
        'Only the student who booked this session can dispute it',
      );
    }

    // Check if there is already an active dispute ticket for this session
    const activeDispute = await this.prisma.disputeTicket.findFirst({
      where: {
        sessionId: command.sessionId,
        status: {
          in: [DisputeStatus.OPEN, DisputeStatus.IN_REVIEW],
        },
      },
    });

    if (activeDispute) {
      throw new ConflictException(
        'A dispute ticket for this session is already open or in review',
      );
    }

    // Start a transaction to upsert student attendance notes and create the dispute ticket
    const ticket = await this.prisma.$transaction(async (tx) => {
      // Upsert the session attendance for the student with their report
      await tx.sessionAttendance.upsert({
        where: {
          sessionId_studentId: {
            sessionId: command.sessionId,
            studentId: command.studentId,
          },
        },
        create: {
          sessionId: command.sessionId,
          studentId: command.studentId,
          studentNotes: command.reason,
        },
        update: {
          studentNotes: command.reason,
        },
      });

      // Create the dispute ticket
      return tx.disputeTicket.create({
        data: {
          sessionId: command.sessionId,
          bookingId: session.bookingId,
          reporterId: command.studentId,
          targetId: session.booking!.tutorId,
          reason: command.reason,
          status: DisputeStatus.OPEN,
        },
      });
    });

    return new DisputeSessionResult(
      ticket.id,
      ticket.bookingId,
      ticket.sessionId,
      ticket.reporterId,
      ticket.targetId,
      ticket.reason,
      ticket.status as DisputeStatus,
      ticket.createdAt.toISOString(),
      ticket.updatedAt.toISOString(),
    );
  }
}
