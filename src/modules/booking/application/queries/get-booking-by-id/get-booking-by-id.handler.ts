import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../../shared/infrastructure/database/prisma/prisma.service';
import { GetBookingByIdQuery } from './get-booking-by-id.query';
import { BookingResultData } from '../get-bookings/get-bookings.result';
import {
  TutoringMode,
  BookingStatus,
} from '../../../../../shared/domain/enums/enums';

@QueryHandler(GetBookingByIdQuery)
export class GetBookingByIdHandler implements IQueryHandler<GetBookingByIdQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetBookingByIdQuery): Promise<BookingResultData> {
    const booking = await this.prisma.booking.findFirst({
      where: {
        id: query.id,
        OR: [{ studentId: query.userId }, { tutorId: query.userId }],
      },
      include: {
        student: true,
        tutor: { include: { user: true } },
        subject: true,
        scheduleRules: true,
      },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with id ${query.id} not found`);
    }

    return {
      id: booking.id,
      studentId: booking.studentId,
      tutorId: booking.tutorId,
      subjectId: booking.subjectId,
      mode: booking.mode as TutoringMode,
      status: booking.status as BookingStatus,
      price: booking.price,
      message: booking.message,
      createdAt: booking.createdAt,
      student: {
        id: booking.student.id,
        nickname: booking.student.nickname ?? null,
        avatarUrl: booking.student.avatarUrl ?? null,
      },
      tutor: {
        id: booking.tutor.id,
        name: booking.tutor.user.nickname || 'Gia sư',
        avatarUrl: booking.tutor.user.avatarUrl ?? null,
      },
      subject: booking.subject
        ? {
            id: booking.subject.id,
            name: booking.subject.name,
            slug: booking.subject.slug,
          }
        : null,
      scheduleRules: booking.scheduleRules.map((rule) => ({
        dayOfWeek: rule.dayOfWeek,
        startTime: rule.startTime,
        endTime: rule.endTime,
      })),
    };
  }
}
