import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import {
  BookingStatus,
  PaymentStatus,
  TutoringMode,
} from '../../../../../shared/domain/enums/enums';
import { PrismaService } from '../../../../../shared/infrastructure/database/prisma/prisma.service';
import { IBookingRepository } from '../../../domain/repositories/booking.repository.interface';
import { RenewBookingCommand } from './renew-booking.command';
import { RenewBookingResult } from './renew-booking.result';
import { SessionGeneratorService } from '../../../domain/services/session-generator.service';

@CommandHandler(RenewBookingCommand)
export class RenewBookingHandler
  implements
    ICommandHandler<RenewBookingCommand>,
    ICommand<RenewBookingCommand, RenewBookingResult>
{
  constructor(
    @Inject(IBookingRepository)
    private readonly bookingRepository: IBookingRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(command: RenewBookingCommand): Promise<RenewBookingResult> {
    const { bookingId, studentId, totalSessions, message } = command;

    // 1. Fetch the original booking
    const original = await this.bookingRepository.findById(bookingId);

    if (!original) {
      throw new NotFoundException(`Booking with id ${bookingId} not found`);
    }

    const tutor = await this.prisma.tutor.findUnique({
      where: { id: original.tutorId },
      select: { pricePerHour: true },
    });

    // 2. Only the student who owns the booking can renew it
    if (original.studentId !== studentId) {
      throw new ForbiddenException('You are not allowed to renew this booking');
    }

    // 3. Generate sessions based on original schedule rules
    const generatedSessions = SessionGeneratorService.generateSessions(
      totalSessions,
      original.scheduleRules || [],
      new Date(),
    );

    const totalPrice = SessionGeneratorService.calculateBookingPrice(
      tutor?.pricePerHour ?? 0,
      generatedSessions,
      totalSessions,
    );

    // 4. Clone booking with new totalSessions / message, status = PENDING
    const renewed = await this.prisma.booking.create({
      data: {
        studentId: original.studentId,
        tutorId: original.tutorId,
        subjectId: original.subjectId,
        mode: original.mode,
        price: totalPrice,
        totalSessions,
        message: message ?? null,
        status: BookingStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        // Preserve schedule rules from original booking
        ...(original.scheduleRules && original.scheduleRules.length > 0
          ? {
              scheduleRules: {
                create: original.scheduleRules.map((rule) => ({
                  dayOfWeek: rule.dayOfWeek,
                  startTime: rule.startTime,
                  endTime: rule.endTime,
                })),
              },
            }
          : {}),
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

    return new RenewBookingResult(
      renewed.id,
      renewed.studentId,
      renewed.tutorId,
      renewed.subjectId,
      renewed.mode as TutoringMode,
      renewed.status as BookingStatus,
      renewed.totalSessions ?? totalSessions,
      renewed.message,
      renewed.createdAt.toISOString(),
    );
  }
}
