import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '../../../../../../generated/prisma/client';
import {
  createQueryResult,
  QueryResult,
} from '../../../../../shared/domain/common/query';
import { PrismaService } from '../../../../../shared/infrastructure/database/prisma/prisma.service';
import { GetBookingsQuery } from './get-bookings.query';
import { BookingResultData } from './get-bookings.result';
import {
  BookingStatus,
  TutoringMode,
} from '../../../../../shared/domain/enums/enums';

@QueryHandler(GetBookingsQuery)
export class GetBookingsQueryHandler implements IQueryHandler<GetBookingsQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    query: GetBookingsQuery,
  ): Promise<QueryResult<BookingResultData>> {
    const { userId, role, params } = query;

    const where: Prisma.BookingWhereInput = {};

    if (role === 'STUDENT') {
      where.studentId = userId;
    } else if (role === 'TUTOR') {
      where.tutorId = userId;
    }

    if (params.status) {
      where.status = params.status;
    }

    if (params.mode) {
      where.mode = params.mode;
    }

    const orderBy: Prisma.BookingOrderByWithRelationInput = {};
    const sortBy = params.sortBy || 'createdAt';
    const sortOrder = params.sortOrder || 'desc';

    if (sortBy === 'createdAt') {
      orderBy.createdAt = sortOrder;
    } else if (sortBy === 'price') {
      orderBy.price = sortOrder;
    } else {
      orderBy[sortBy] = sortOrder;
    }

    const skip = (params.page - 1) * params.limit;

    const [items, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        orderBy,
        skip,
        take: params.limit,
        include: {
          student: true,
          tutor: { include: { user: true } },
          subject: true,
          scheduleRules: true,
        },
      }),
      this.prisma.booking.count({ where }),
    ]);

    const data: BookingResultData[] = items.map((item) => ({
      id: item.id,
      studentId: item.studentId,
      tutorId: item.tutorId,
      subjectId: item.subjectId,
      mode: item.mode as TutoringMode,
      status: item.status as BookingStatus,
      price: item.price,
      message: item.message,
      createdAt: item.createdAt,
      student: {
        id: item.student.id,
        nickname: item.student.nickname ?? null,
        avatarUrl: item.student.avatarUrl ?? null,
      },
      tutor: {
        id: item.tutor.id,
        name: item.tutor.user.nickname || 'Gia sư',
        avatarUrl: item.tutor.user.avatarUrl ?? null,
      },
      subject: item.subject
        ? {
            id: item.subject.id,
            name: item.subject.name,
            slug: item.subject.slug,
          }
        : null,
      scheduleRules: item.scheduleRules.map((rule) => ({
        dayOfWeek: rule.dayOfWeek,
        startTime: rule.startTime,
        endTime: rule.endTime,
      })),
    }));

    return createQueryResult(data, total, { ...params, skip });
  }
}
