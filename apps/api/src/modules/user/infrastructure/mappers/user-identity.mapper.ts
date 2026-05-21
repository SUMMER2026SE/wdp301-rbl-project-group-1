import {
  Prisma,
  AuthProvider as PrismaAuthProvider,
  UserIdentity as PrismaUserIdentity,
} from '../../../../../generated/prisma/client';
import { IMapper } from '../../../../shared/application/interfaces/mapper.interface';
import { AuthProvider } from '../../../../shared/domain/enums/enums';
import { UserIdentity } from '../../domain/entities/user-identity.entity';

export class UserIdentityMapper implements IMapper<
  UserIdentity,
  PrismaUserIdentity | Prisma.UserIdentityUncheckedCreateInput
> {
  toDomain(raw: PrismaUserIdentity): UserIdentity {
    return UserIdentity.create(raw.id, {
      userId: raw.userId,
      provider: raw.provider as AuthProvider,
      providerUserId: raw.providerUserId,
      email: raw.email ?? undefined,
      emailVerified: raw.emailVerified,
      avatarUrl: raw.avatarUrl ?? undefined,
      createdAt: raw.createdAt,
    });
  }

  toPersistence(domain: UserIdentity): Prisma.UserIdentityUncheckedCreateInput {
    return {
      userId: domain.userId,
      provider: domain.provider as unknown as PrismaAuthProvider,
      providerUserId: domain.providerUserId,
      email: domain.email,
      emailVerified: domain.emailVerified,
      avatarUrl: domain.avatarUrl,
      createdAt: domain.createdAt,
    };
  }
}
