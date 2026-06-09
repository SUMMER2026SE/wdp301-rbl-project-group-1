import {
  Prisma,
  User as PrismaUser,
  UserRole as PrismaUserRole,
} from '../../../../../generated/prisma/client';
import { IMapper } from '../../../../shared/application/interfaces/mapper.interface';
import { Gender, UserRole } from '../../../../shared/domain/enums/enums';
import { User } from '../../domain/entities/user.entity';

export class UserMapper implements IMapper<
  User,
  PrismaUser | Prisma.UserUncheckedCreateInput
> {
  toDomain(raw: PrismaUser): User {
    return User.create(raw.id, {
      email: raw.email,
      password: raw.password,
      role: raw.role as UserRole,
      isActive: raw.isActive,
      isVerified: raw.isVerified,
      isFlag: raw.isFlag,
      reportCount: raw.reportCount,
      createdAt: raw.createdAt,

      // Profile fields
      nickname: raw.nickname,
      avatarUrl: raw.avatarUrl,
      phone: raw.phone,
      dateOfBirth: raw.dateOfBirth,
      gender: raw.gender ? (raw.gender as unknown as Gender) : null,
      address: raw.address,

      // Student fields
      school: raw.school,
      learningGoal: raw.learningGoal,
    });
  }

  toPersistence(domain: User): Prisma.UserUncheckedCreateInput {
    return {
      email: domain.email,
      password: domain.password!,
      role: domain.role as unknown as PrismaUserRole,
      isActive: domain.isActive,
      isVerified: domain.isVerified,
      isFlag: domain.isFlag,
      reportCount: domain.reportCount,
      createdAt: domain.createdAt,

      // Profile fields
      nickname: domain.nickname ?? null,
      avatarUrl: domain.avatarUrl ?? null,
      phone: domain.phone ?? null,
      dateOfBirth: domain.dateOfBirth ?? null,
      gender: domain.gender ?? null,
      address: domain.address ?? null,

      // Student fields
      school: domain.school ?? null,
      learningGoal: domain.learningGoal ?? null,
    };
  }
}
