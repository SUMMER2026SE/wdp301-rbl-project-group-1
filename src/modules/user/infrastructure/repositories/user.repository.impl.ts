import { Injectable } from '@nestjs/common';
import {
  Prisma,
  User as PrismaUser,
  UserRole as PrismaUserRole,
} from '../../../../../generated/prisma/client';
import { UserRole } from '../../../../shared/domain/enums/enums';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma/prisma.service';
import { User } from '../../domain/entities/user.entity';
import {
  FindAllUsersParams,
  FindAllUsersResult,
  IUserRepository,
} from '../../domain/repositories/user.repository.interface';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToDomain(userPrisma: PrismaUser): User {
    return User.create(userPrisma.id, {
      email: userPrisma.email,
      password: userPrisma.password,
      role: userPrisma.role as UserRole,
      nickname: userPrisma.nickname,
      isActive: userPrisma.isActive,
      isVerified: userPrisma.isVerified,
      isFlag: userPrisma.isFlag,
      reportCount: userPrisma.reportCount,
      createdAt: userPrisma.createdAt,
    });
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
        nickname: (value) => ({
          nickname: { contains: value, mode: 'insensitive' },
        }),
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
    const data = {
      email: user.email,
      password: user.password!,
      role: user.role as unknown as PrismaUserRole,
      nickname: user.nickname,
      isActive: user.isActive,
      isVerified: user.isVerified,
      isFlag: user.isFlag,
      reportCount: user.reportCount,
      createdAt: user.createdAt,
    };

    const savedUser = user.id
      ? await this.prisma.user.update({ where: { id: user.id }, data })
      : await this.prisma.user.create({ data });

    return this.mapToDomain(savedUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    return this.mapToDomain(user);
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return this.mapToDomain(user);
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
      items: users.map((user) => this.mapToDomain(user)),
      total,
    };
  }
}
