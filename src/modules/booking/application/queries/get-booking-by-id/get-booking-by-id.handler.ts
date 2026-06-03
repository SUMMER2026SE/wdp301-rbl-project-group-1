import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { IBookingRepository } from '../../../domain/repositories/booking.repository.interface';
import { GetBookingByIdQuery } from './get-booking-by-id.query';
import { BookingResultData } from '../get-bookings/get-bookings.result';

@QueryHandler(GetBookingByIdQuery)
export class GetBookingByIdHandler implements IQueryHandler<GetBookingByIdQuery> {
  constructor(
    @Inject(IBookingRepository)
    private readonly bookingRepository: IBookingRepository,
  ) {}

  async execute(query: GetBookingByIdQuery): Promise<BookingResultData> {
    const booking = await this.bookingRepository.findById(query.id);

    // Make sure booking belongs to user
    if (booking && booking.studentId !== query.userId && booking.tutorId !== query.userId) {
      throw new NotFoundException(`Booking with id ${query.id} not found`);
    }

    if (!booking) {
      throw new NotFoundException(`Booking with id ${query.id} not found`);
    }

    return {
      id: booking.id,
      studentId: booking.studentId,
      tutorId: booking.tutorId,
      subjectId: booking.subjectId,
      mode: booking.mode,
      status: booking.status,
      price: booking.price,
      message: booking.message,
      createdAt: booking.createdAt,
      student: {
        id: booking.student?.id || '',
        nickname: booking.student?.nickname ?? null,
        avatarUrl: booking.student?.avatarUrl ?? null,
      },
      tutor: {
        id: booking.tutor?.id || '',
        name: booking.tutor?.name || 'Gia sư',
        avatarUrl: booking.tutor?.avatarUrl ?? null,
      },
      subject: booking.subject
        ? {
            id: booking.subject.id,
            name: booking.subject.name,
            slug: booking.subject.slug,
          }
        : null,
      scheduleRules: booking.scheduleRules?.map((rule) => ({
        dayOfWeek: rule.dayOfWeek,
        startTime: rule.startTime,
        endTime: rule.endTime,
      })) || [],
    };
  }
}
