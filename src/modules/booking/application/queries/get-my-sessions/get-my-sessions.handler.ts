import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from '../../../../../shared/infrastructure/database/prisma/prisma.service';
import { GetMySessionsQuery } from './get-my-sessions.query';
import { MySessionResultData } from './get-my-sessions.result';
import { SessionStatus } from '../../../../../shared/domain/enums/enums';
import {
  createQueryResult,
  QueryResult,
} from '../../../../../shared/domain/common/query';

@QueryHandler(GetMySessionsQuery)
export class GetMySessionsHandler implements IQueryHandler<GetMySessionsQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    query: GetMySessionsQuery,
  ): Promise<QueryResult<MySessionResultData>> {
    const { userId, role, query: params } = query;

    // Filter by date range if provided
    const dateFilter: { gte?: Date; lte?: Date } = {};
    if (params.startDate) {
      dateFilter.gte = new Date(params.startDate);
    }
    if (params.endDate) {
      dateFilter.lte = new Date(params.endDate);
    }
    const hasDateFilter = Object.keys(dateFilter).length > 0;

    // Find sessions belonging to bookings where the user is either student or tutor
    const sessions = await this.prisma.session.findMany({
      where: {
        ...(hasDateFilter && {
          startTime: dateFilter,
        }),
        booking: {
          ...(role === 'STUDENT' ? { studentId: userId } : { tutorId: userId }),
        },
      },
      include: {
        booking: {
          include: {
            student: true,
            tutor: { include: { user: true } },
            subject: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    const items = sessions.map((session) => {
      let counterpartName = 'Người dùng ẩn danh';
      let subjectName = 'Khóa học';
      let subjectId = '';

      if (session.booking) {
        if (role === 'STUDENT') {
          counterpartName =
            session.booking.tutor?.user?.nickname ?? 'Gia sư ẩn danh';
        } else {
          counterpartName =
            session.booking.student?.nickname ?? 'Học viên ẩn danh';
        }
        subjectName = session.booking.subject?.name ?? 'Khóa học';
        subjectId = session.booking.subjectId ?? '';
      }

      return {
        id: session.id,
        bookingId: session.bookingId,
        tutorRequestId: session.tutorRequestId,
        title: session.title ?? subjectName,
        startTime: session.startTime,
        endTime: session.endTime,
        status: (session.status as SessionStatus) || SessionStatus.SCHEDULED,
        meetingUrl: session.meetingUrl,
        notes: session.notes,
        order: session.order,
        createdAt: session.createdAt,
        counterpartName,
        subjectName,
        subjectId,
      };
    });

    return createQueryResult(items, items.length, {
      page: 1,
      limit: items.length,
      skip: 0,
    });
  }
}
