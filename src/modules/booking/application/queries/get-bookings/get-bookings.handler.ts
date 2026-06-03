import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  createQueryResult,
  QueryResult,
} from '../../../../../shared/domain/common/query';
import { IBookingRepository } from '../../../domain/repositories/booking.repository.interface';
import { GetBookingsQuery } from './get-bookings.query';
import { BookingResultData } from './get-bookings.result';

@QueryHandler(GetBookingsQuery)
export class GetBookingsQueryHandler implements IQueryHandler<GetBookingsQuery> {
  constructor(
    @Inject(IBookingRepository)
    private readonly bookingRepository: IBookingRepository,
  ) {}

  async execute(
    query: GetBookingsQuery,
  ): Promise<QueryResult<BookingResultData>> {
    const result = await this.bookingRepository.findAll(query.params);

    const data: BookingResultData[] = result.data.map((item) => ({
      id: item.id,
      studentId: item.studentId,
      tutorId: item.tutorId,
      subjectId: item.subjectId,
      mode: item.mode,
      status: item.status,
      price: item.price,
      message: item.message,
      createdAt: item.createdAt,
      student: {
        id: item.student?.id || '',
        nickname: item.student?.nickname ?? null,
        avatarUrl: item.student?.avatarUrl ?? null,
      },
      tutor: {
        id: item.tutor?.id || '',
        name: item.tutor?.name || 'Gia sư',
        avatarUrl: item.tutor?.avatarUrl ?? null,
      },
      subject: item.subject
        ? {
            id: item.subject.id,
            name: item.subject.name,
            slug: item.subject.slug,
          }
        : null,
      scheduleRules: item.scheduleRules?.map((rule) => ({
        dayOfWeek: rule.dayOfWeek,
        startTime: rule.startTime,
        endTime: rule.endTime,
      })) || [],
    }));

    return createQueryResult(data, result.total, query.params);
  }
}
