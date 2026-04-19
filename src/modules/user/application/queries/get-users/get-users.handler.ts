import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  Prisma,
  UserRole as PrismaUserRole,
} from '../../../../../../generated/prisma/client';
import {
  createQueryResult,
  QueryResult,
} from '../../../../../shared/application/common/query';
import { IQuery } from '../../../../../shared/application/interfaces/use-case.interface';
import { PrismaService } from '../../../../../shared/infrastructure/database/prisma/prisma.service';
import { GetUsersQuery } from './get-users.query';
import { GetUsersResultData } from './get-users.result';

@QueryHandler(GetUsersQuery)
export class GetUsersQueryHandler
  implements
    IQueryHandler<GetUsersQuery>,
    IQuery<GetUsersQuery, QueryResult<GetUsersResultData>>
{
  constructor(private readonly prisma: PrismaService) {}

  private buildWhereClause(
    query: GetUsersQuery['query'],
  ): Prisma.UserWhereInput {
    const where: Prisma.UserWhereInput = {};

    if (query.search) {
      where.email = { contains: query.search, mode: 'insensitive' };
    }

    const filterMap: Record<string, (value: string) => Prisma.UserWhereInput> =
      {
        email: (value) => ({ email: { contains: value, mode: 'insensitive' } }),
        role: (value) => ({ role: value as PrismaUserRole }),
        isActive: (value) => ({ isActive: value === 'true' }),
        isVerified: (value) => ({ isVerified: value === 'true' }),
        isFlag: (value) => ({ isFlag: value === 'true' }),
        reportCount: (value) => ({ reportCount: Number.parseInt(value, 10) }),
      };

    for (const [key, value] of Object.entries(query.filters || {})) {
      const mapper = filterMap[key];
      if (mapper) {
        Object.assign(where, mapper(value));
      }
    }

    return where;
  }

  async execute(
    query: GetUsersQuery,
  ): Promise<QueryResult<GetUsersResultData>> {
    const where = this.buildWhereClause(query.query);

    const orderBy = query.query.sortBy
      ? { [query.query.sortBy]: query.query.sortOrder ?? 'asc' }
      : { createdAt: 'desc' as const };

    const [total, users] = await this.prisma.$transaction([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        orderBy: orderBy as Prisma.UserOrderByWithRelationInput,
        skip: query.query.skip,
        take: query.query.limit,
        include: { profile: true },
      }),
    ]);

    const data: GetUsersResultData[] = users.map(
      (user: Prisma.UserGetPayload<{ include: { profile: true } }>) => ({
        id: user.id,
        email: user.email,
        role: user.role,
        nickname: user.profile?.nickname ?? null,
        isActive: user.isActive,
        isVerified: user.isVerified,
        isFlag: user.isFlag,
        reportCount: user.reportCount,
        createdAt: user.createdAt,
      }),
    );

    return createQueryResult(data, total, query.query);
  }
}
