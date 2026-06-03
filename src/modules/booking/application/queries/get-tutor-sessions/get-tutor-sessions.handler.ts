import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from '../../../../../shared/infrastructure/database/prisma/prisma.service';
import { GetTutorSessionsQuery } from './get-tutor-sessions.query';
import { MySessionResultData } from '../get-my-sessions/get-my-sessions.result';
import { SessionStatus } from '../../../../../shared/domain/enums/enums';
import {
  createQueryResult,
  QueryResult,
} from '../../../../../shared/domain/common/query';

@QueryHandler(GetTutorSessionsQuery)
export class GetTutorSessionsHandler implements IQueryHandler<GetTutorSessionsQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    query: GetTutorSessionsQuery,
  ): Promise<QueryResult<MySessionResultData>> {
    const { tutorId, query: params } = query;

    // Filter by date range if provided
    const dateFilter: { gte?: Date; lte?: Date } = {};
    if (params.startDate) {
      dateFilter.gte = new Date(params.startDate);
    }
    if (params.endDate) {
      dateFilter.lte = new Date(params.endDate);
    }
    const hasDateFilter = Object.keys(dateFilter).length > 0;

    // Find sessions belonging to bookings where the tutor is the requested tutor
    const sessions = await this.prisma.session.findMany({
      where: {
        ...(hasDateFilter && {
          startTime: dateFilter,
        }),
        booking: {
          tutorId: tutorId,
        },
        status: {
          not: 'CANCELLED', // We don't need to show cancelled sessions to the public
        },
      },
      include: {
        booking: {
          include: {
            subject: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    const items = sessions.map((session) => {
      let subjectName = 'Khóa học';
      let subjectId = '';

      if (session.booking) {
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
        meetingUrl: null, // Redacted for public view
        notes: null, // Redacted for public view
        order: session.order,
        createdAt: session.createdAt,
        counterpartName: 'Học viên ẩn danh', // Redacted for public view
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
