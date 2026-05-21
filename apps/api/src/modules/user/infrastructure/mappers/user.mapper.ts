import {
  Prisma,
  User as PrismaUser,
  UserRole as PrismaUserRole,
} from '../../../../../generated/prisma/client';
import { IMapper } from '../../../../shared/application/interfaces/mapper.interface';
import { UserRole } from '../../../../shared/domain/enums/enums';
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
    };
  }
}
