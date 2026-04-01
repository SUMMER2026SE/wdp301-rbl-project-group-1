import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma/prisma.service';
import { UserRole } from '../../../../shared/domain/enums/enums';
import {
  User as PrismaUser,
  UserRole as PrismaUserRole,
} from '../../../../../generated/prisma/client';

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
}
