import { Injectable } from '@nestjs/common';
import {
  Prisma,
  UserRole as PrismaUserRole,
} from '../../../../../generated/prisma/client';
import {
  createQueryResult,
  QueryResult,
} from '../../../../shared/domain/common/query';
import { PrismaTransactionContext } from '../../../../shared/infrastructure/database/prisma/prisma-transaction.context';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma/prisma.service';
import { Tutor } from '../../domain/entities/tutor.entity';
import {
  ITutorRepository,
  TutorPaginatedParams,
  TutorWithProfile,
} from '../../domain/repositories/tutor.repository.interface';

@Injectable()
export class PrismaTutorRepository implements ITutorRepository {
  constructor(private readonly prisma: PrismaService) {}

  private get client() {
    return PrismaTransactionContext.getClient() ?? this.prisma;
  }

  async findByUserId(userId: string): Promise<Tutor | null> {
    const tutor = await this.client.tutor.findUnique({ where: { id: userId } });
    if (!tutor) return null;

    return Tutor.create(tutor.id, {
      userId: tutor.id,
      bio: tutor.bio,
      specialization: tutor.specialization,
      experience: tutor.experience,
      education: tutor.education,
      pricePerHour: tutor.pricePerHour,
      rating: tutor.rating,
      reviewCount: tutor.reviewCount,
      studentCount: tutor.studentCount,
    });
  }

  async save(tutor: Tutor): Promise<void> {
    await this.client.tutor.update({
      where: { id: tutor.userId },
      data: {
        bio: tutor.bio ?? null,
        specialization: tutor.specialization ?? null,
        experience: tutor.experience ?? null,
        education: tutor.education ?? null,
        pricePerHour: tutor.pricePerHour ?? null,
      },
    });
  }

  async findAll(
    params: TutorPaginatedParams,
  ): Promise<QueryResult<TutorWithProfile>> {
    const where: Prisma.UserWhereInput = {
      role: PrismaUserRole.TUTOR,
    };

    const andConditions: Prisma.UserWhereInput[] = [];

    if (params.search) {
      const search = params.search;
      andConditions.push({
        OR: [
          {
            // nickname is now directly on User (merged from Profile)
            nickname: { contains: search, mode: 'insensitive' },
          },
          {
            tutor: {
              specialization: { contains: search, mode: 'insensitive' },
            },
          },
        ],
      });
    }

    if (params.specialization) {
      andConditions.push({
        tutor: {
          specialization: {
            contains: params.specialization,
            mode: 'insensitive',
          },
        },
      });
    }

    if (params.minPrice !== undefined || params.maxPrice !== undefined) {
      const priceFilter: Prisma.FloatFilter = {};
      if (params.minPrice !== undefined) priceFilter.gte = params.minPrice;
      if (params.maxPrice !== undefined) priceFilter.lte = params.maxPrice;
      andConditions.push({
        tutor: {
          pricePerHour: priceFilter,
        },
      });
    }

    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    const sortOrder = params.sortOrder ?? 'asc';
    const orderByMap: Record<string, Prisma.UserOrderByWithRelationInput> = {
      createdAt: { createdAt: sortOrder },
      nickname: { nickname: sortOrder },
      pricePerHour: { tutor: { pricePerHour: sortOrder } },
      rating: { tutor: { rating: sortOrder } },
      reviewCount: { tutor: { reviewCount: sortOrder } },
      studentCount: { tutor: { studentCount: sortOrder } },
    };

    const orderBy =
      params.sortBy && orderByMap[params.sortBy]
        ? orderByMap[params.sortBy]
        : { createdAt: 'desc' as const };

    const [total, users] = await this.client.$transaction([
      this.client.user.count({ where }),
      this.client.user.findMany({
        where,
        orderBy,
        skip: params.skip,
        take: params.limit,
        include: { tutor: true },
      }),
    ]);

    const data: TutorWithProfile[] = users.map((user) => ({
      tutor: Tutor.create(user.id, {
        userId: user.id,
        bio: user.tutor?.bio ?? null,
        specialization: user.tutor?.specialization ?? null,
        experience: user.tutor?.experience ?? null,
        education: user.tutor?.education ?? null,
        pricePerHour: user.tutor?.pricePerHour ?? null,
        rating: user.tutor?.rating ?? 0,
        reviewCount: user.tutor?.reviewCount ?? 0,
        studentCount: user.tutor?.studentCount ?? 0,
      }),
      profile: {
        // nickname and avatarUrl are now directly on User
        nickname: user.nickname ?? null,
        avatarUrl: user.avatarUrl ?? null,
      },
    }));

    return createQueryResult(data, total, params);
  }
}
