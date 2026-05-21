import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  Prisma,
  UserRole as PrismaUserRole,
} from '../../../../../../generated/prisma/client';
import { IQuery } from '../../../../../shared/application/interfaces/use-case.interface';
import {
  createQueryResult,
  QueryResult,
} from '../../../../../shared/domain/common/query';
import { PrismaService } from '../../../../../shared/infrastructure/database/prisma/prisma.service';
import { GetTutorsQuery } from './get-tutors.query';
import { GetTutorsResultData } from './get-tutors.result';

@QueryHandler(GetTutorsQuery)
export class GetTutorsQueryHandler
  implements
    IQueryHandler<GetTutorsQuery>,
    IQuery<GetTutorsQuery, QueryResult<GetTutorsResultData>>
{
  constructor(private readonly prisma: PrismaService) {}

  private buildWhereClause(
    query: GetTutorsQuery['query'],
  ): Prisma.UserWhereInput {
    const where: Prisma.UserWhereInput = {
      role: PrismaUserRole.TUTOR,
    };

    const filters = query.filters ?? {};
    const andConditions: Prisma.UserWhereInput[] = [];

    if (query.search) {
      const search = query.search;
      andConditions.push({
        OR: [
          {
            profile: {
              nickname: { contains: search, mode: 'insensitive' },
            },
          },
          {
            tutor: {
              specialization: { contains: search, mode: 'insensitive' },
            },
          },
        ],
      });
    }

    if (filters.specialization) {
      andConditions.push({
        tutor: {
          specialization: {
            contains: filters.specialization,
            mode: 'insensitive',
          },
        },
      });
    }

    const minPrice = Number.parseFloat(filters.minPrice ?? '');
    if (!Number.isNaN(minPrice)) {
      andConditions.push({
        tutor: {
          pricePerHour: { gte: minPrice },
        },
      });
    }

    const maxPrice = Number.parseFloat(filters.maxPrice ?? '');
    if (!Number.isNaN(maxPrice)) {
      andConditions.push({
        tutor: {
          pricePerHour: { lte: maxPrice },
        },
      });
    }

    const minRating = Number.parseFloat(filters.minRating ?? '');
    if (!Number.isNaN(minRating)) {
      andConditions.push({
        tutor: {
          rating: { gte: minRating },
        },
      });
    }

    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    return where;
  }

  private buildOrderBy(
    query: GetTutorsQuery['query'],
  ): Prisma.UserOrderByWithRelationInput {
    const sortOrder = query.sortOrder ?? 'asc';

    const orderByMap: Record<string, Prisma.UserOrderByWithRelationInput> = {
      createdAt: { createdAt: sortOrder },
      nickname: { profile: { nickname: sortOrder } },
      pricePerHour: { tutor: { pricePerHour: sortOrder } },
      rating: { tutor: { rating: sortOrder } },
      reviewCount: { tutor: { reviewCount: sortOrder } },
      studentCount: { tutor: { studentCount: sortOrder } },
    };

    if (query.sortBy && orderByMap[query.sortBy]) {
      return orderByMap[query.sortBy];
    }

    return { createdAt: 'desc' };
  }

  async execute(
    query: GetTutorsQuery,
  ): Promise<QueryResult<GetTutorsResultData>> {
    const where = this.buildWhereClause(query.query);
    const orderBy = this.buildOrderBy(query.query);

    const [total, users] = await this.prisma.$transaction([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        orderBy,
        skip: query.query.skip,
        take: query.query.limit,
        include: { profile: true, tutor: true },
      }),
    ]);

    const data: GetTutorsResultData[] = users.map(
      (
        user: Prisma.UserGetPayload<{
          include: { profile: true; tutor: true };
        }>,
      ) => ({
        id: user.id,
        nickname: user.profile?.nickname ?? null,
        avatarUrl: user.profile?.avatarUrl ?? null,
        bio: user.tutor?.bio ?? null,
        specialization: user.tutor?.specialization ?? null,
        experience: user.tutor?.experience ?? null,
        education: user.tutor?.education ?? null,
        pricePerHour: user.tutor?.pricePerHour ?? null,
        rating: user.tutor?.rating ?? 0,
        reviewCount: user.tutor?.reviewCount ?? 0,
        studentCount: user.tutor?.studentCount ?? 0,
      }),
    );

    return createQueryResult(data, total, query.query);
  }
}
