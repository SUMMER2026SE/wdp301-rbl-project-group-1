import {
  ForbiddenException,
  Inject,
  NotFoundException,
} from '@nestjs/common';
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

    // 2. Only the student who owns the booking can renew it
    if (original.studentId !== studentId) {
      throw new ForbiddenException(
        'You are not allowed to renew this booking',
      );
    }

    // 3. Clone booking with new totalSessions / message, status = PENDING
    const renewed = await this.prisma.booking.create({
      data: {
        studentId: original.studentId,
        tutorId: original.tutorId,
        subjectId: original.subjectId,
        mode: original.mode as TutoringMode,
        price: original.price,
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
