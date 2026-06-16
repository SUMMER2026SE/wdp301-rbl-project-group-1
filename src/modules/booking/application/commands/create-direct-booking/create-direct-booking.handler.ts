import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import {
  BookingStatus,
  TutoringMode,
} from '../../../../../shared/domain/enums/enums';
import { PrismaService } from '../../../../../shared/infrastructure/database/prisma/prisma.service';
import { CreateDirectBookingCommand } from './create-direct-booking.command';
import { CreateDirectBookingResult } from './create-direct-booking.result';
import { SessionGeneratorService } from '../../../domain/services/session-generator.service';
import { EventBus } from '@nestjs/cqrs';
import { BookingCreatedEvent } from '../../../domain/events/booking-events';

@CommandHandler(CreateDirectBookingCommand)
export class CreateDirectBookingHandler
  implements
    ICommandHandler<CreateDirectBookingCommand>,
    ICommand<CreateDirectBookingCommand, CreateDirectBookingResult>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(
    command: CreateDirectBookingCommand,
  ): Promise<CreateDirectBookingResult> {
    // Validate tutor exists
    const tutor = await this.prisma.tutor.findUnique({
      where: { id: command.tutorId },
      select: { id: true, pricePerHour: true },
    });

    if (!tutor) {
      throw new NotFoundException(`Tutor with id ${command.tutorId} not found`);
    }

    const generatedSessions = SessionGeneratorService.generateSessions(
      command.totalSessions,
      command.scheduleRules,
      new Date(), // Default to today as startDate
    );

    const totalPrice = SessionGeneratorService.calculateBookingPrice(
      tutor.pricePerHour ?? 0,
      generatedSessions,
      command.totalSessions,
    );

    // Create booking with schedule rules in transaction
    const booking = await this.prisma.booking.create({
      data: {
        studentId: command.studentId,
        tutorId: command.tutorId,
        subjectId: command.subjectId,
        mode: command.mode as TutoringMode,
        status: BookingStatus.PENDING,
        price: totalPrice,
        message: command.message,
        totalSessions: command.totalSessions,
        startDate:
          generatedSessions.length > 0 ? generatedSessions[0].startTime : null,
        scheduleRules: command.scheduleRules.length
          ? {
              create: command.scheduleRules.map((rule) => ({
                dayOfWeek: rule.dayOfWeek,
                startTime: rule.startTime,
                endTime: rule.endTime,
              })),
            }
          : undefined,
        sessions: generatedSessions.length
          ? {
              create: generatedSessions.map((session) => ({
                startTime: session.startTime,
                endTime: session.endTime,
                order: session.order,
                status: session.status,
              })),
            }
          : undefined,
      },
    });

    this.eventBus.publish(
      new BookingCreatedEvent(
        booking.id,
        booking.studentId,
        booking.tutorId,
        booking.message ?? '',
      ),
    );

    return new CreateDirectBookingResult(
      booking.id,
      booking.studentId,
      booking.tutorId,
      booking.subjectId,
      booking.mode as TutoringMode,
      booking.status as BookingStatus,
      booking.message,
      booking.createdAt.toISOString(),
    );
  }
}
