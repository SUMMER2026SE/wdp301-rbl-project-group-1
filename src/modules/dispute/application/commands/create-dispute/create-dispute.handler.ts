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
import { CreateDisputeCommand } from './create-dispute.command';
import { CreateDisputeResult } from './create-dispute.result';
import { EventBus } from '@nestjs/cqrs';
import { DisputeCreatedEvent } from '../../../domain/events/dispute-events';

@CommandHandler(CreateDisputeCommand)
export class CreateDisputeHandler
  implements
    ICommandHandler<CreateDisputeCommand>,
    ICommand<CreateDisputeCommand, CreateDisputeResult>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateDisputeCommand): Promise<CreateDisputeResult> {
    if (!command.bookingId && !command.sessionId) {
      throw new BadRequestException(
        'At least one of bookingId or sessionId must be provided',
      );
    }

    let bookingId = command.bookingId;
    let targetId: string | null = null;

    if (command.sessionId) {
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
        throw new BadRequestException(
          `Session with ID ${command.sessionId} is not associated with any booking`,
        );
      }

      bookingId = session.bookingId;

      if (command.role === 'STUDENT') {
        if (session.booking.studentId !== command.reporterId) {
          throw new ForbiddenException(
            'Only the student of this session can file a dispute',
          );
        }
        targetId = session.booking.tutorId;
      } else {
        if (session.booking.tutorId !== command.reporterId) {
          throw new ForbiddenException(
            'Only the tutor of this session can file a dispute',
          );
        }
        targetId = session.booking.studentId;
      }

      // Check for active dispute ticket for this session
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
          'An active dispute ticket for this session already exists',
        );
      }

      // Submit report (SessionAttendance) and create dispute ticket in a transaction
      const ticket = await this.prisma.$transaction(async (tx) => {
        if (command.role === 'STUDENT') {
          await tx.sessionAttendance.upsert({
            where: {
              sessionId_studentId: {
                sessionId: command.sessionId!,
                studentId: command.reporterId,
              },
            },
            create: {
              sessionId: command.sessionId!,
              studentId: command.reporterId,
              studentNotes: command.reason,
            },
            update: {
              studentNotes: command.reason,
            },
          });
        } else {
          // Tutor report
          await tx.sessionAttendance.upsert({
            where: {
              sessionId_studentId: {
                sessionId: command.sessionId!,
                studentId: targetId!,
              },
            },
            create: {
              sessionId: command.sessionId!,
              studentId: targetId!,
              notes: command.reason,
            },
            update: {
              notes: command.reason,
            },
          });
        }

        return tx.disputeTicket.create({
          data: {
            sessionId: command.sessionId,
            bookingId: bookingId,
            reporterId: command.reporterId,
            targetId: targetId,
            reason: command.reason,
            status: DisputeStatus.OPEN,
          },
        });
      });
      const result = new CreateDisputeResult(
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

      this.eventBus.publish(
        new DisputeCreatedEvent(
          ticket.id,
          ticket.reporterId,
          ticket.targetId as string,
          ticket.reason,
        ),
      );

      return result;
    } else {
      // Only bookingId is provided
      const booking = await this.prisma.booking.findUnique({
        where: { id: bookingId! },
      });

      if (!booking) {
        throw new NotFoundException(`Booking with ID ${bookingId} not found`);
      }

      if (command.role === 'STUDENT') {
        if (booking.studentId !== command.reporterId) {
          throw new ForbiddenException(
            'Only the student of this booking can file a dispute',
          );
        }
        targetId = booking.tutorId;
      } else {
        if (booking.tutorId !== command.reporterId) {
          throw new ForbiddenException(
            'Only the tutor of this booking can file a dispute',
          );
        }
        targetId = booking.studentId;
      }

      // Check for active dispute ticket for this booking (without a specific session)
      const activeDispute = await this.prisma.disputeTicket.findFirst({
        where: {
          bookingId: bookingId,
          sessionId: null,
          status: {
            in: [DisputeStatus.OPEN, DisputeStatus.IN_REVIEW],
          },
        },
      });

      if (activeDispute) {
        throw new ConflictException(
          'An active dispute ticket for this booking already exists',
        );
      }

      const ticket = await this.prisma.disputeTicket.create({
        data: {
          bookingId: bookingId,
          reporterId: command.reporterId,
          targetId: targetId,
          reason: command.reason,
          status: DisputeStatus.OPEN,
        },
      });

      const result = new CreateDisputeResult(
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

      this.eventBus.publish(
        new DisputeCreatedEvent(
          ticket.id,
          ticket.reporterId,
          ticket.targetId as string,
          ticket.reason,
        ),
      );

      return result;
    }
  }
}
