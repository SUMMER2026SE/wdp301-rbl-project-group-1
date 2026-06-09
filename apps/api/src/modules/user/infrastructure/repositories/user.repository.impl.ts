import { Injectable } from '@nestjs/common';
import {
  Prisma,
  UserRole as PrismaUserRole,
} from '../../../../../generated/prisma/client';
import { PrismaTransactionContext } from '../../../../shared/infrastructure/database/prisma/prisma-transaction.context';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma/prisma.service';
import { User } from '../../domain/entities/user.entity';
import {
  FindAllUsersParams,
  FindAllUsersResult,
  IUserRepository,
} from '../../domain/repositories/user.repository.interface';

import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  private readonly mapper = new UserMapper();

  constructor(private readonly prisma: PrismaService) {}

  /** Returns the ambient tx client inside a UoW block, or the root PrismaService. */
  private get client() {
    return PrismaTransactionContext.getClient() ?? this.prisma;
  }

  private buildWhereClause(params: FindAllUsersParams): Prisma.UserWhereInput {
    const where: Prisma.UserWhereInput = {};

    if (params.search) {
      where.OR = [
        { email: { contains: params.search, mode: 'insensitive' } },
        { nickname: { contains: params.search, mode: 'insensitive' } },
      ];
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

    for (const [key, value] of Object.entries(params.filters ?? {})) {
      const mapper = filterMap[key];

      if (!mapper) {
        continue;
      }

      const mapped = mapper(value);
      Object.assign(where, mapped);
    }

    return where;
  }

  async save(user: User): Promise<User> {
    const data = this.mapper.toPersistence(user);

    const tutorData = user.tutor
      ? {
          bio: user.tutor.bio,
          specialization: user.tutor.specialization,
          experience: user.tutor.experience,
          education: user.tutor.education,
          pricePerHour: user.tutor.pricePerHour,
          rating: user.tutor.rating,
          reviewCount: user.tutor.reviewCount,
          studentCount: user.tutor.studentCount,
        }
      : {};

    const savedUser = user.id
      ? await this.client.user.update({
          where: { id: user.id },
          data: {
            ...data,
            tutor:
              data.role === PrismaUserRole.TUTOR
                ? { upsert: { create: tutorData, update: tutorData } }
                : undefined,
          } as Prisma.UserUpdateInput,
        })
      : await this.client.user.create({
          data: {
            ...data,
            tutor:
              data.role === PrismaUserRole.TUTOR
                ? { create: tutorData }
                : undefined,
          } as Prisma.UserCreateInput,
        });

    return this.mapper.toDomain(savedUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) return null;
    return this.mapper.toDomain(user);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) return null;
    return this.mapper.toDomain(user);
  }

  async findAll(params: FindAllUsersParams): Promise<FindAllUsersResult> {
    const where = this.buildWhereClause(params);

    const orderBy = params.sortBy
      ? { [params.sortBy]: params.sortOrder ?? 'asc' }
      : { createdAt: 'desc' as const };

    const [total, users] = await this.prisma.$transaction([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        orderBy: orderBy as Prisma.UserOrderByWithRelationInput,
        skip: params.skip,
        take: params.limit,
      }),
    ]);

    return {
      items: users.map((user) => this.mapper.toDomain(user)),
      total,
    };
  }

  /** Update student M:M grades via Prisma implicit relation set */
  async updateStudentGrades(userId: string, gradeIds: string[]): Promise<void> {
    await this.client.user.update({
      where: { id: userId },
      data: {
        grades: {
          set: gradeIds.map((id) => ({ id })),
        },
      },
    });
  }

  /** Update student M:M subjects via Prisma implicit relation set */
  async updateStudentSubjects(
    userId: string,
    subjectIds: string[],
  ): Promise<void> {
    await this.client.user.update({
      where: { id: userId },
      data: {
        subjects: {
          set: subjectIds.map((id) => ({ id })),
        },
      },
    });
  }
}
