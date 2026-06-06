import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '../../../../../../generated/prisma/client';
import { IQuery } from '../../../../../shared/application/interfaces/use-case.interface';
import {
  createQueryResult,
  QueryResult,
} from '../../../../../shared/domain/common/query';
import {
  RequestStatus,
  TutoringMode,
} from '../../../../../shared/domain/enums/enums';
import { PrismaService } from '../../../../../shared/infrastructure/database/prisma/prisma.service';
import { GetTutorRequestsQuery } from './get-tutor-requests.query';
import { TutorRequestResultData } from './get-tutor-requests.result';

@QueryHandler(GetTutorRequestsQuery)
export class GetTutorRequestsQueryHandler
  implements
    IQueryHandler<GetTutorRequestsQuery>,
    IQuery<GetTutorRequestsQuery, QueryResult<TutorRequestResultData>>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    query: GetTutorRequestsQuery,
  ): Promise<QueryResult<TutorRequestResultData>> {
    const { params } = query;

    const where: Prisma.TutorRequestWhereInput = {};

    if (params.studentId) {
      where.studentId = params.studentId;
    }

    if (params.status) {
      where.status = params.status;
    }

    if (params.mode) {
      where.mode = params.mode;
    }

    if (params.subjectIds?.length) {
      where.subjectId = { in: params.subjectIds };
    }

    if (params.gradeIds?.length) {
      where.gradeId = { in: params.gradeIds };
    }

    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const orderBy: Prisma.TutorRequestOrderByWithRelationInput = {};
    const sortBy = params.sortBy || 'createdAt';
    const sortOrder = params.sortOrder || 'desc';

    if (sortBy === 'createdAt') {
      orderBy.createdAt = sortOrder;
    } else if (sortBy === 'budget') {
      orderBy.budget = sortOrder;
    } else {
      orderBy[sortBy] = sortOrder;
    }

    const [items, total] = await Promise.all([
      this.prisma.tutorRequest.findMany({
        where,
        orderBy,
        skip: params.skip,
        take: params.limit,
        include: {
          student: true,
          subject: true,
          grade: true,
          scheduleRules: true,
          _count: {
            select: {
              bids: true,
            },
          },
        },
      }),
      this.prisma.tutorRequest.count({ where }),
    ]);

    const data: TutorRequestResultData[] = items.map((item) => ({
      id: item.id,
      studentId: item.studentId,
      subjectId: item.subjectId,
      gradeId: item.gradeId,
      title: item.title,
      description: item.description,
      mode: item.mode as TutoringMode,
      budget: item.budget,
      status: item.status as RequestStatus,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      student: {
        id: item.student.id,
        nickname: item.student.nickname ?? null,
        avatarUrl: item.student.avatarUrl ?? null,
      },
      subject: item.subject
        ? {
            id: item.subject.id,
            name: item.subject.name,
            slug: item.subject.slug,
          }
        : null,
      grade: item.grade
        ? {
            id: item.grade.id,
            name: item.grade.name,
            slug: item.grade.slug,
            order: item.grade.order,
          }
        : null,
      bidCount: item._count.bids,
      scheduleRules: item.scheduleRules.map((rule) => ({
        dayOfWeek: rule.dayOfWeek,
        startTime: rule.startTime,
        endTime: rule.endTime,
      })),
    }));

    return createQueryResult(data, total, params);
  }
}
